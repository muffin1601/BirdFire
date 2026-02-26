import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { clientSecret } = await req.json()
  const intentId = clientSecret.split('_secret')[0]

  const intent = await stripe.paymentIntents.retrieve(intentId)

  if (intent.status !== 'succeeded') {
    return NextResponse.json({ status: intent.status })
  }

  const userId = intent.metadata.user_id

  const { data } = await supabase
    .from('cart_items')
    .select(`
      quantity,
      product:products (
        id,
        name,
        price,
        product_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq('user_id', userId)

  const cart = data ?? []

  const total = cart.reduce(
    (s: number, i: any) => s + i.product.price * i.quantity,
    0
  )

  const orderNumber = intent.id.slice(-8).toUpperCase()

  const { data: order } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      total,
      currency: intent.currency,
      payment_intent: intent.id
    })
    .select()
    .single()

  const items = cart.map((i: any) => ({
    order_id: order.id,
    product_id: i.product.id,
    product_name: i.product.name,
    price: i.product.price,
    quantity: i.quantity,
    image_url:
      i.product.product_images.find((p: any) => p.is_primary)?.image_url
  }))

  await supabase.from('order_items').insert(items)
  await supabase.from('cart_items').delete().eq('user_id', userId)

  return NextResponse.json({
    status: 'succeeded',
    orderId: order.id,
    orderNumber,
    created: new Date(intent.created * 1000).toLocaleDateString()
  })
}