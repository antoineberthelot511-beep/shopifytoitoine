import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Paiement par virement bancaire</h1>
        <p className="mb-8 max-w-sm text-gray-500 leading-relaxed">
          Remplis le formulaire de contact et on t'envoie les coordonnées de virement après confirmation. La boutique est livrée sous 48h après réception du paiement.
        </p>
        <Link
          href="/landing#contact"
          className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Faire une demande →
        </Link>
      </main>
    </>
  )
}
