import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import AddToCartButton from './AddToCartButton'
import { notFound } from 'next/navigation'
import type { Product } from '@/contexts/CartContext'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  const price = (product.price / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  })

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-200 text-8xl">
                □
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-900">{price}</p>
            {product.stock === 0 ? (
              <span className="inline-block w-fit rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                Rupture de stock
              </span>
            ) : (
              <span className="inline-block w-fit rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
              </span>
            )}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}
            {product.stock > 0 && <AddToCartButton product={product as Product} />}
          </div>
        </div>
      </main>
    </>
  )
}
