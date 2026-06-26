'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  active: boolean
  description: string
  images: string[]
}

type FormState = {
  name: string
  price: string
  stock: string
  description: string
  images: string
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const EMPTY_FORM: FormState = {
  name: '',
  price: '',
  stock: '',
  description: '',
  images: '',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const images = form.images
      ? form.images.split(',').map(s => s.trim()).filter(Boolean)
      : []
    await supabase.from('products').insert({
      name: form.name,
      slug: slugify(form.name),
      price: Math.round(parseFloat(form.price) * 100),
      stock: parseInt(form.stock, 10),
      description: form.description,
      images,
      active: true,
    })
    setForm(EMPTY_FORM)
    await fetchProducts()
    setSaving(false)
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('products').update({ active: !active }).eq('id', id)
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, active: !active } : p))
    )
  }

  const updateStock = async (id: string, raw: string) => {
    const stock = parseInt(raw, 10)
    if (isNaN(stock) || stock < 0) return
    await supabase.from('products').update({ stock }).eq('id', id)
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock } : p)))
  }

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Produits</h1>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-800">Ajouter un produit</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Nom</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Mon super produit"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Prix (€)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="29.90"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Stock initial</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Images (URLs, séparées par virgule)
            </label>
            <input
              value={form.images}
              onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-gray-600">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Ajouter le produit'}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">Aucun produit.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Produit</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Prix</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">/produit/{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{fmt(product.price)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      onBlur={e => updateStock(product.id, e.target.value)}
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(product.id, product.active)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        product.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {product.active ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
