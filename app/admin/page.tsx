'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  created_at: string
  customer_name: string
  customer_email: string
  total: number
  status: string
}

const ALL_STATUSES = ['pending', 'paid', 'shipped', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('id, created_at, customer_name, customer_email, total, status')
      .order('created_at', { ascending: false })
      .limit(200)

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
  }

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  const filterLabels: Record<string, string> = {
    all: 'Tous',
    pending: 'En attente',
    paid: 'Payé',
    shipped: 'Expédié',
    cancelled: 'Annulé',
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Commandes</h1>
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...ALL_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? 'bg-black text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {filterLabels[s]}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Aucune commande.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Client</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(order.created_at).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">{fmt(order.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>
                          {filterLabels[s]}
                        </option>
                      ))}
                    </select>
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
