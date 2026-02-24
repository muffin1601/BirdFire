'use client'

import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment</h3>

      <PaymentElement />

      <button type="submit">Pay now</button>
    </form>
  )
}