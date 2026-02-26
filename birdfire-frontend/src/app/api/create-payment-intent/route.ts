import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseServer } from '@/lib/supabaseServer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' }
  }
)

export async function POST(req: Request) {
  console.log('--- CREATE PAYMENT INTENT ---')

  console.log(
    'HEADERS:',
    Object.fromEntries(req.headers.entries())
  )

  const authHeader = req.headers.get('authorization')
  console.log('AUTH HEADER:', authHeader)

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  const {
    data: { user },
    error
  } = await supabaseAdmin.auth.getUser(token)

  console.log('SUPABASE USER:', user)
  console.log('SUPABASE ERROR:', error)

  if (!user || error) {
    return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
  }

  const { data: cartItems, error: cartError } = await supabaseServer
  .from('cart_items')
  .select(`
    quantity,
    product:products (
      price
    )
  `)
  .eq('user_id', user.id)

  console.log('CART ITEMS (SERVER):', cartItems)

  if (cartError || !cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart empty' }, { status: 400 })
  }

  const total = cartItems.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  )

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'inr',
    automatic_payment_methods: { enabled: true },
    metadata: {
      user_id: user.id
    }
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret
  })
}