import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/contexts/CartContext'

export default function ProductCard({ product }: { product: Product }) {
  const price = (product.price / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  })

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square bg-gray-100">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {product.stock === 0 && (
          <span className="absolute left-2 top-2 rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
            Rupture
          </span>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-gray-900">{product.name}</h2>
        <p className="mt-1 text-sm font-medium text-gray-700">{price}</p>
      </div>
    </Link>
  )
}
