'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ETAPES_ORDER = ['Paiement reçu', 'En construction', 'En test', 'Livré']

const STATUT_STYLES: Record<string, string> = {
  'En attente': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'En cours': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'En test': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Livré': 'bg-green-500/15 text-green-400 border-green-500/20',
  'Annulé': 'bg-red-500/15 text-red-400 border-red-500/20',
}

type Project = {
  id: string
  nom: string
  offre: string
  statut: string
  etapes: string[]
  created_at: string
}

export default function ClientDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [prenom, setPrenom] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const [{ data: profile }, { data: projs }] = await Promise.all([
        supabase.from('profiles').select('prenom').eq('id', user.id).single(),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
      ])

      if (profile) setPrenom(profile.prenom)
      setProjects(projs || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: null }),
    })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#7c3aed] font-bold text-xl">Σ Sigma</span>
            {prenom && (
              <span className="text-white/40 text-sm">· Bonjour, {prenom}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white/40 hover:text-white transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Mes projets</h1>

        {projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-white/50 text-sm">
              Ton projet apparaîtra ici une fois confirmé par notre équipe.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map(project => {
              const completed = (project.etapes || []).filter(e =>
                ETAPES_ORDER.includes(e)
              ).length
              const progress = Math.round((completed / ETAPES_ORDER.length) * 100)

              return (
                <div
                  key={project.id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-lg">{project.nom}</h2>
                      <p className="text-white/40 text-sm mt-0.5">{project.offre}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                      STATUT_STYLES[project.statut] || 'bg-white/10 text-white/50 border-white/10'
                    }`}>
                      {project.statut}
                    </span>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between mb-2">
                      {ETAPES_ORDER.map((etape, i) => {
                        const done = project.etapes?.includes(etape)
                        return (
                          <div key={i} className="flex flex-col items-center gap-1 flex-1">
                            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                              done ? 'bg-[#7c3aed]' : 'bg-white/15'
                            }`} />
                            <span className={`text-[10px] text-center leading-tight ${
                              done ? 'text-[#7c3aed]' : 'text-white/30'
                            }`}>
                              {etape}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="h-1 bg-white/10 rounded-full mt-1">
                      <div
                        className="h-full bg-[#7c3aed] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/client/projet/${project.id}`}
                    className="inline-flex items-center gap-2 bg-[#7c3aed]/15 text-[#7c3aed] text-sm px-4 py-2 rounded-xl hover:bg-[#7c3aed]/25 transition border border-[#7c3aed]/20"
                  >
                    Ouvrir le chat
                    <span>→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
