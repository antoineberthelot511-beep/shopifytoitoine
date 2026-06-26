import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'
import type { Product } from '@/contexts/CartContext'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Nos produits</h1>
        {!products || products.length === 0 ? (
          <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.map(p => (
              <ProductCard key={p.id} product={p as Product} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
