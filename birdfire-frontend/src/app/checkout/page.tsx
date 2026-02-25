'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { supabase } from '@/lib/supabaseClient'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const loadCheckout = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: cart } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          product:products (
            name,
            price,
            product_images (
              image_url,
              is_primary
            )
          )
        `)
        .eq('user_id', session.user.id)

      setCartItems(cart || [])

      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      const data = await res.json()
      setClientSecret(data.clientSecret)
    }

    loadCheckout()
  }, [])

  if (!clientSecret) return <p>Loading checkout…</p>

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm cartItems={cartItems} />
    </Elements>
  )
}