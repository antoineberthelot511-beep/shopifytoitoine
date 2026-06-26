'use client'

import Navbar from '@/components/Navbar'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import Link from 'next/link'

const SHIPPING = 490

export default function CartPage() {
  const { items, removeFromCart, addToCart, total } = useCart()

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  const grandTotal = total + (items.length > 0 ? SHIPPING : 0)

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Mon panier</h1>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center text-gray-500">
            <p className="text-lg">Votre panier est vide.</p>
            <Link href="/" className="text-sm font-medium text-black underline underline-offset-2">
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 border-b border-gray-100 pb-6">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 text-2xl">□</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{fmt(product.price)} / unité</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold">{fmt(product.price * quantity)}</p>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span>Livraison</span>
                <span>{fmt(SHIPPING)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-black py-3 text-center font-semibold text-white transition hover:bg-gray-800"
              >
                Commander →
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
