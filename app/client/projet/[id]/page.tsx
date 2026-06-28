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
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)

      const [{ data: project }, { data: msgs }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('messages').select('*').eq('project_id', id).order('created_at', { ascending: true }),
      ])

      if (!project) {
        router.push('/client')
        return
      }

      setProject(project)
      setMessages(msgs || [])
      setLoading(false)
    }
    load()
  }, [id, router])

  useEffect(() => {
    const channel = supabase
      .channel(`client-project-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${id}` },
        payload => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !userId) return

    const text = content.trim()
    setContent('')

    await supabase.from('messages').insert({
      project_id: id,
      sender_id: userId,
      sender_role: 'client',
      content: text,
    })

    inputRef.current?.focus()
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
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-white/25 text-sm py-10">
              Aucun message pour l'instant. Dites bonjour !
            </p>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_role === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender_role === 'client'
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
      <form onSubmit={sendMessage} className="border-t border-white/10 px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-[#7c3aed] text-sm transition"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="bg-[#7c3aed] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition disabled:opacity-30 shrink-0"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  )
}
