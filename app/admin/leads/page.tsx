'use client'

// SQL à exécuter une fois dans Supabase :
// ALTER TABLE leads ADD COLUMN IF NOT EXISTS statut text DEFAULT 'Nouveau';

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

type Lead = {
  id: string
  created_at: string
  prenom: string
  email: string
  offre: string
  niche: string
  message: string
  statut: string
}

const ALL_STATUTS = ['Nouveau', 'En discussion', 'Devis envoyé', 'Gagné', 'Perdu'] as const

const statutStyle: Record<string, string> = {
  'Nouveau':        'bg-blue-50   text-blue-700   border-blue-200',
  'En discussion':  'bg-amber-50  text-amber-700  border-amber-200',
  'Devis envoyé':   'bg-purple-50 text-purple-700 border-purple-200',
  'Gagné':          'bg-green-50  text-green-700  border-green-200',
  'Perdu':          'bg-red-50    text-red-600    border-red-200',
}

const offreBadge: Record<string, string> = {
  Starter: 'bg-gray-100 text-gray-600',
  Pro:     'bg-violet-100 text-violet-700',
  Premium: 'bg-indigo-100 text-indigo-700',
}

function truncate(str: string, n = 80) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

export default function AdminLeadsPage() {
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
    setAllLeads(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStatut = async (id: string, statut: string) => {
    await supabase.from('leads').update({ statut }).eq('id', id)
    setAllLeads((prev) => prev.map((l) => (l.id === id ? { ...l, statut } : l)))
  }

  const counts = ALL_STATUTS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = allLeads.filter((l) => (l.statut ?? 'Nouveau') === s).length
    return acc
  }, {})

  const filtered =
    filter === 'all'
      ? allLeads
      : allLeads.filter((l) => (l.statut ?? 'Nouveau') === filter)

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  const replyHref = (l: Lead) =>
    `mailto:${l.email}?subject=${encodeURIComponent(`Re: Ta boutique Sigma Shop — Offre ${l.offre}`)}&body=${encodeURIComponent(`Salut ${l.prenom},\n\n`)}`

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">{allLeads.length} demande{allLeads.length !== 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      {/* Compteurs par statut */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            filter === 'all' ? 'bg-black text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Tous <span className="ml-1 text-xs opacity-60">{allLeads.length}</span>
        </button>
        {ALL_STATUTS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s ? 'bg-black text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {s}
            {counts[s] > 0 && (
              <span className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                filter === s ? 'bg-white/20 text-white' : s === 'Nouveau' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {counts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tableau */}
      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Aucune lead{filter !== 'all' ? ` avec le statut "${filter}"` : ''}.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Prénom</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Offre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Niche</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 max-w-xs">Message</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const statut = lead.statut ?? 'Nouveau'
                return (
                  <tr key={lead.id} className={`border-b border-gray-100 last:border-0 transition-colors ${statut === 'Gagné' ? 'bg-green-50/40' : 'hover:bg-gray-50/60'}`}>
                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{fmtDate(lead.created_at)}</td>

                    {/* Prénom */}
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{lead.prenom}</td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="text-violet-600 hover:text-violet-800 hover:underline transition-colors">
                        {lead.email}
                      </a>
                    </td>

                    {/* Offre */}
                    <td className="px-4 py-3">
                      {lead.offre ? (
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${offreBadge[lead.offre] ?? 'bg-gray-100 text-gray-600'}`}>
                          {lead.offre}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Niche */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {lead.niche || <span className="text-gray-300">—</span>}
                    </td>

                    {/* Message */}
                    <td className="px-4 py-3 text-gray-500 max-w-xs" title={lead.message}>
                      {truncate(lead.message)}
                    </td>

                    {/* Statut select inline */}
                    <td className="px-4 py-3">
                      <select
                        value={statut}
                        onChange={(e) => updateStatut(lead.id, e.target.value)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-violet-400 transition-colors ${statutStyle[statut] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {ALL_STATUTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={replyHref(lead)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors whitespace-nowrap"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                          </svg>
                          Répondre
                        </a>
                        {statut !== 'Gagné' && (
                          <button
                            onClick={() => updateStatut(lead.id, 'Gagné')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors whitespace-nowrap"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Gagné
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
