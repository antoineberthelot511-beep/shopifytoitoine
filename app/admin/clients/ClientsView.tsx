'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUTS = ['En attente', 'En cours', 'En test', 'Livré', 'Annulé']

const STATUT_STYLES: Record<string, string> = {
  'En attente': 'text-yellow-400',
  'En cours': 'text-blue-400',
  'En test': 'text-orange-400',
  'Livré': 'text-green-400',
  'Annulé': 'text-red-400',
}

type AuthUser = { id: string; email: string; prenom: string }
type Profile = { prenom: string; email: string }
type Project = {
  id: string
  nom: string
  offre: string
  statut: string
  created_at: string
  profiles: Profile | null
}

export default function ClientsView({
  initialProjects,
  users,
}: {
  initialProjects: Project[]
  users: AuthUser[]
}) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ client_id: '', nom: '', offre: '' })
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  async function updateStatut(projectId: string, statut: string) {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, statut } : p))
    const res = await fetch(`/api/admin/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    if (!res.ok) router.refresh()
  }

  async function createProject() {
    if (!form.client_id || !form.nom || !form.offre) return
    setCreating(true)
    setFormError('')

    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      setFormError(data.error || 'Erreur lors de la création')
      setCreating(false)
      return
    }

    setForm({ client_id: '', nom: '', offre: '' })
    setShowForm(false)
    setCreating(false)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg">
            <span className="text-[#7c3aed]">Σ</span> Admin — Clients
          </span>
          <button
            onClick={() => { setShowForm(!showForm); setFormError('') }}
            className="bg-[#7c3aed] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition"
          >
            + Créer un projet
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {showForm && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold mb-5">Nouveau projet client</h2>
            <div className="space-y-3">
              <select
                value={form.client_id}
                onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c3aed] transition"
              >
                <option value="" className="bg-[#1a1a1a] text-white/40">
                  Sélectionner un client...
                </option>
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-[#1a1a1a] text-white">
                    {u.prenom ? `${u.prenom} — ${u.email}` : u.email}
                  </option>
                ))}
              </select>
              <input
                placeholder="Nom du projet"
                value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] transition"
              />
              <input
                placeholder="Offre (ex: Site vitrine, E-commerce, Landing page...)"
                value={form.offre}
                onChange={e => setForm(f => ({ ...f, offre: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] transition"
              />
              {formError && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={createProject}
                  disabled={creating || !form.client_id || !form.nom || !form.offre}
                  className="bg-[#7c3aed] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#6d28d9] transition disabled:opacity-40"
                >
                  {creating ? 'Création...' : 'Créer'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setFormError('') }}
                  className="text-white/40 text-sm px-4 py-2 rounded-lg hover:text-white transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm">Aucun projet pour l'instant.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-white/20 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">
                      {project.profiles?.prenom || '—'}
                    </span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/40 text-xs truncate">{project.profiles?.email}</span>
                  </div>
                  <p className="text-white/60 text-sm truncate">
                    {project.nom}
                    {project.offre && (
                      <span className="text-white/30"> · {project.offre}</span>
                    )}
                  </p>
                </div>

                <select
                  value={project.statut}
                  onChange={e => updateStatut(project.id, e.target.value)}
                  className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#7c3aed] transition shrink-0 ${
                    STATUT_STYLES[project.statut] || 'text-white/60'
                  }`}
                >
                  {STATUTS.map(s => (
                    <option key={s} value={s} className="bg-[#1a1a1a] text-white">
                      {s}
                    </option>
                  ))}
                </select>

                <Link
                  href={`/admin/chat/${project.id}`}
                  className="bg-[#7c3aed]/15 text-[#7c3aed] text-xs px-3.5 py-2 rounded-lg hover:bg-[#7c3aed]/25 transition border border-[#7c3aed]/20 shrink-0 whitespace-nowrap"
                >
                  Chat →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
