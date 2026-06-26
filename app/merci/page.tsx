'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

export default function MerciPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Commande confirmée !</h1>
        <p className="mb-8 max-w-sm text-gray-600">
          Merci pour votre achat. Vous recevrez un e-mail de confirmation dans quelques minutes.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Continuer mes achats
        </Link>
      </main>
    </>
  )
}
