'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        prenom,
      })

      if (data.session) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: data.session.access_token }),
        })
        router.push('/client')
      } else {
        setError('Vérifiez votre email pour confirmer votre compte.')
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative">
      <Link href="/landing" className="absolute top-4 left-4 text-xs text-white/30 hover:text-white/60 transition">
        ← Accueil
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="text-3xl font-bold text-[#7c3aed]">Σ</span>
          <h1 className="text-2xl font-bold text-white mt-3">Créer un compte</h1>
          <p className="text-white/40 text-sm mt-1">Rejoignez l'espace client Sigma</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] transition"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe (8 caractères min.)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#7c3aed] transition"
            required
          />

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#7c3aed] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
