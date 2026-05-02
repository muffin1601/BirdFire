'use client'

import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import styles from './Checkout.module.css'

interface CheckoutProductImage {
  image_url: string
  is_primary: boolean
}

interface CheckoutCartItem {
  quantity: number
  product?: {
    name: string
    price: number
    product_images?: CheckoutProductImage[]
  }
}

interface CheckoutFormProps {
  cartItems: CheckoutCartItem[]
  user: User | null
}

export default function CheckoutForm({ cartItems, user }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = cartItems.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      window.location.href = '/login'
      return
    }

    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`
        }
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Payment error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Payment</h2>

        {error && <div className={styles.errorAlert}>{error}</div>}

        {!user && (
          <div className={styles.authPrompt}>
            <p>Please log in to complete your purchase</p>
            <Link href="/login" className={styles.btnAuthPrompt}>
              Sign In / Create Account
            </Link>
          </div>
        )}

        <PaymentElement />

        <button
          type="submit"
          className={styles.btnSubmit}
          disabled={!stripe || isProcessing || !user}
        >
          {isProcessing ? (
            <>
              <span className={styles.spinner}></span>
              Processing…
            </>
          ) : (
            <span>Pay ₹{total.toFixed(2)}</span>
          )}
        </button>

        {!user && (
          <p className={styles.authNote}>
            You must sign in to complete your order
          </p>
        )}
      </form>

      {/* RIGHT */}
      <aside className={styles.summary}>
        <h3 className={styles.summaryTitle}>Order summary</h3>

        {cartItems.length === 0 ? (
          <p className={styles.emptyCart}>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item, idx) => {
              const image =
                item.product?.product_images?.find((i) => i.is_primary)
                  ?.image_url

              return (
                <div key={idx} className={styles.item}>
                  {image && <img src={image} alt={item.product?.name} />}
                  <div className={styles.itemInfo}>
                    <p>{item.product?.name}</p>
                    <span>Qty {item.quantity}</span>
                  </div>
                  <strong className={styles.itemPrice}>
                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </strong>
                </div>
              )
            })}

            <div className={styles.total}>
              <span>Total</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
