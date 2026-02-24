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

  useEffect(() => {
  const loadPaymentIntent = async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      window.location.href = '/login'
      return
    }

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    const data = await res.json()
    setClientSecret(data.clientSecret)
  }

  loadPaymentIntent()
}, [])

  if (!clientSecret) return <p>Loading checkout...</p>

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  )
}