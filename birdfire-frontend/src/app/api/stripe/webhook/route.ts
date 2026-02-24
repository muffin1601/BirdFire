import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { supabaseServer } from '@/lib/supabaseServer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
 
  const body = await req.text()

 
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event


  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = supabaseServer


  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent

    const orderId = intent.metadata.order_id
    const userId = intent.metadata.user_id

    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId)

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
  }


  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent

    await supabase
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', intent.metadata.order_id)
  }

  return NextResponse.json({ received: true })
}