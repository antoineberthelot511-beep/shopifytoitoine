'use client'

import { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ETAPES_ORDER = ['Paiement reçu', 'En construction', 'En test', 'Livré']

type Message = {
  id: string
  content: string
  sender_role: string
  sender_id: string
  created_at: string
}

type Project = {
  id: string
  nom: string
  offre: string
  statut: string
  etapes: string[]
}

export default function ProjetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [prenom, setPrenom] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFirstScroll = useRef(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)

      const [{ data: project }, msgsRes, { data: profile }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        fetch(`/api/client/projects/${id}/messages`),
        supabase.from('profiles').select('prenom').eq('id', user.id).single(),
      ])

      if (!project) { router.push('/client'); return }

      setProject(project)
      if (profile?.prenom) setPrenom(profile.prenom)
      if (msgsRes.ok) setMessages(await msgsRes.json())
      setLoading(false)
    }
    load()
  }, [id, router])

  // Realtime : supabase anon key pour les subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`client-project-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${id}` },
        payload => {
          setMessages(prev => {
            // évite les doublons si le message vient du realtime ET de l'optimistic update
            if (prev.some(m => m.id === (payload.new as Message).id)) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  // Scroll : instant au chargement initial, smooth pour les nouveaux messages
  useEffect(() => {
    if (!bottomRef.current) return
    bottomRef.current.scrollIntoView({
      behavior: isFirstScroll.current ? 'instant' : 'smooth',
    })
    isFirstScroll.current = false
  }, [messages])

  async function handleSend() {
    if (!content.trim() || !userId) return

    const text = content.trim()
    setContent('')

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const optimistic: Message = {
      id: tempId,
      content: text,
      sender_role: 'client',
      sender_id: userId,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    const res = await fetch(`/api/client/projects/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_id: userId, content: text }),
    })

    if (res.ok) {
      const saved: Message = await res.json()
      // Remplace le message temporaire par l'ID réel
      setMessages(prev => prev.map(m => m.id === tempId ? saved : m))
    } else {
      // Rollback si erreur
      setMessages(prev => prev.filter(m => m.id !== tempId))
    }

    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
      <header className="border-b border-white/10 px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/client" className="text-white/40 hover:text-white transition text-sm p-1">
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">{project?.nom}</h1>
            <p className="text-white/40 text-xs truncate">{project?.offre}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/20 shrink-0">
            {project?.statut}
          </span>
        </div>
      </header>

      {/* Étapes */}
      <div className="border-b border-white/10 px-4 py-2.5 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2 flex-wrap">
          {ETAPES_ORDER.map(etape => {
            const done = project?.etapes?.includes(etape)
            return (
              <span
                key={etape}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  done
                    ? 'bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30'
                    : 'bg-white/5 text-white/25 border border-white/5'
                }`}
              >
                {done ? '✓ ' : ''}{etape}
              </span>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-white/25 text-sm py-10">
              Aucun message pour l'instant. Dites bonjour !
            </p>
          )}
          {messages.map(msg => {
            const isClient = msg.sender_role === 'client'
            const senderName = isClient ? prenom : 'Sigma Shop'
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isClient ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-white/30 px-1">{senderName}</span>
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isClient
                      ? 'bg-[#7c3aed] text-white rounded-br-md'
                      : 'bg-white/10 text-white/90 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre message... (Entrée pour envoyer)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-[#7c3aed] text-sm transition"
          />
          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className="bg-[#7c3aed] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition disabled:opacity-30 shrink-0"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
