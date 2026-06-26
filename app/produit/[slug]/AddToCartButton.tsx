'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/contexts/CartContext'

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAdd = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Quantité</span>
        <div className="flex items-center rounded-lg border border-gray-300">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-l-lg"
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
            className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
      >
        {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
      </button>
    </div>
  )
}
