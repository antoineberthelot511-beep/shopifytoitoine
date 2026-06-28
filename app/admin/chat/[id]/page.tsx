'use client'

import { useEffect, useState, useRef, use } from 'react'
import Link from 'next/link'

const ETAPES_ORDER = ['Paiement reçu', 'En construction', 'En test', 'Livré']
const STATUTS = ['En attente', 'En cours', 'En test', 'Livré', 'Annulé']

type Message = {
  id: string
  content: string
  sender_role: string
  created_at: string
}

type Project = {
  id: string
  nom: string
  offre: string
  statut: string
  etapes: string[]
  profiles?: { prenom: string; email: string } | null
}

export default function AdminChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastMessageId = useRef<string | null>(null)

  useEffect(() => {
    async function load() {
      const [projRes, msgsRes] = await Promise.all([
        fetch(`/api/admin/projects/${id}`),
        fetch(`/api/admin/projects/${id}/messages`),
      ])

      if (projRes.ok) setProject(await projRes.json())
      if (msgsRes.ok) {
        const msgs = await msgsRes.json()
        setMessages(msgs)
        if (msgs.length > 0) lastMessageId.current = msgs[msgs.length - 1].id
      }
      setLoading(false)
    }
    load()
  }, [id])

  // Poll for new messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/admin/projects/${id}/messages`)
      if (!res.ok) return
      const msgs: Message[] = await res.json()
      if (msgs.length > 0 && msgs[msgs.length - 1].id !== lastMessageId.current) {
        setMessages(msgs)
        lastMessageId.current = msgs[msgs.length - 1].id
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || sending) return

    const text = content.trim()
    setContent('')
    setSending(true)

    const res = await fetch(`/api/admin/projects/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    })

    if (res.ok) {
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
      lastMessageId.current = msg.id
    }

    setSending(false)
    inputRef.current?.focus()
  }

  async function updateStatut(statut: string) {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    if (res.ok) setProject(prev => prev ? { ...prev, statut } : null)
  }

  async function toggleEtape(etape: string) {
    if (!project) return
    const current = project.etapes || []
    const updated = current.includes(etape)
      ? current.filter(e => e !== etape)
      : [...current, etape]

    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapes: updated }),
    })
    if (res.ok) setProject(prev => prev ? { ...prev, etapes: updated } : null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/10 px-5 py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/admin/clients" className="text-white/40 hover:text-white transition text-sm p-1">
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">
              {project?.nom}
              {project?.profiles?.prenom && (
                <span className="text-white/40 font-normal text-sm ml-2">
                  · {project.profiles.prenom}
                </span>
              )}
            </h1>
            <p className="text-white/30 text-xs truncate">{project?.offre}</p>
          </div>
          <select
            value={project?.statut || ''}
            onChange={e => updateStatut(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#7c3aed] transition shrink-0"
          >
            {STATUTS.map(s => (
              <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Étapes */}
      <div className="border-b border-white/10 px-5 py-3 shrink-0">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-white/30 mb-2">Étapes — cliquez pour cocher/décocher :</p>
          <div className="flex gap-2 flex-wrap">
            {ETAPES_ORDER.map(etape => {
              const done = project?.etapes?.includes(etape)
              return (
                <button
                  key={etape}
                  onClick={() => toggleEtape(etape)}
                  className={`text-xs px-3 py-1.5 rounded-full transition border ${
                    done
                      ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                      : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  {done ? '✓ ' : ''}{etape}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="max-w-5xl mx-auto space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-white/25 text-sm py-10">
              Aucun message pour l'instant.
            </p>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender_role === 'admin'
                    ? 'bg-[#7c3aed] text-white rounded-br-md'
                    : 'bg-white/10 text-white/90 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="border-t border-white/10 px-5 py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Message au client..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-[#7c3aed] text-sm transition"
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="bg-[#7c3aed] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition disabled:opacity-30 shrink-0"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  )
}
