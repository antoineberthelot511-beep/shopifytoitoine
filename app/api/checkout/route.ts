import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

type CartItem = {
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
  quantity: number
}

export async function POST(request: NextRequest) {
  const { name, email, address, items } = await request.json()

  if (!items || items.length === 0) {
    return Response.json({ error: 'Panier vide' }, { status: 400 })
  }

  const lineItems = [
    ...items.map((item: CartItem) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          ...(item.product.images?.[0] ? { images: [item.product.images[0]] } : {}),
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    })),
    {
      price_data: {
        currency: 'eur',
        product_data: { name: 'Livraison' },
        unit_amount: 490,
      },
      quantity: 1,
    },
  ]

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: email,
    success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/panier`,
    metadata: { name, address },
  })

  const orderTotal =
    items.reduce((sum: number, i: CartItem) => sum + i.product.price * i.quantity, 0) + 490

  await supabase.from('orders').insert({
    stripe_session_id: session.id,
    customer_name: name,
    customer_email: email,
    customer_address: address,
    items,
    total: orderTotal,
    status: 'pending',
  })

  return Response.json({ url: session.url })
}
