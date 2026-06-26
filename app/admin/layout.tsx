import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-8">
          <span className="font-bold text-gray-900">Admin</span>
          <nav className="flex gap-6 text-sm font-medium">
            <Link
              href="/admin"
              className="text-gray-600 transition hover:text-black"
            >
              Commandes
            </Link>
            <Link
              href="/admin/produits"
              className="text-gray-600 transition hover:text-black"
            >
              Produits
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  )
}
