'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { useCart } from '@/contexts/CartContext'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Une erreur est survenue')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
        {items.length === 0 ? (
          <p className="text-gray-500">Votre panier est vide.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nom complet</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Jean Dupont"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="jean@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Adresse de livraison</label>
              <textarea
                required
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                rows={3}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="12 rue de la Paix, 75001 Paris"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-sm">
              <p className="mb-2 font-semibold text-gray-700">Récapitulatif</p>
              <div className="flex flex-col gap-1 text-gray-600">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between">
                    <span>{product.name} × {quantity}</span>
                    <span>{fmt(product.price * quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>{fmt(490)}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900">
                <span>Total</span>
                <span>{fmt(total + 490)}</span>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Redirection vers Stripe…' : 'Payer avec Stripe'}
            </button>
          </form>
        )}
      </main>
    </>
  )
}
