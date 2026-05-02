'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/lib/supabaseClient'
import Header from '@/components/layout/Header'
import TopBanner from '@/components/layout/TopBanner'
import Footer from '@/components/layout/Footer'
import styles from './Checkout.module.css'

interface CartItemWithProduct {
  quantity: number
  product: {
    name: string
    price: number
    product_images: Array<{
      image_url: string
      is_primary: boolean
    }>
  }
}

interface CheckoutCartRow {
  quantity: number
  product: CartItemWithProduct['product'] | CartItemWithProduct['product'][] | null
}

export default function CheckoutPage() {
  const { user, loading: authLoading, syncCartAfterLogin } = useAuth()
  const { getLocalCart, clearCart } = useCart()

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    const loadCheckout = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!user) {
          setClientSecret(null)
          setStripePromise(null)

          if (getLocalCart().length === 0) {
            setError('Your cart is empty. Please add items before checking out.')
          }

          return
        }

        const localCart = getLocalCart()

        if (localCart.length > 0) {
          await syncCartAfterLogin(localCart)
          clearCart()
        }

        const { data: cart, error: cartError } = await supabase
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
          .eq('user_id', user.id)

        if (cartError) throw cartError

        const cartRows = (cart || []) as unknown as CheckoutCartRow[]
        setCartItems(
          cartRows
            .map((item) => ({
              quantity: item.quantity,
              product: Array.isArray(item.product) ? item.product[0] : item.product,
            }))
            .filter((item): item is CartItemWithProduct => Boolean(item.product))
        )

        const { data: { session } } = await supabase.auth.getSession()
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        })

        if (!res.ok) {
          let errorMessage = 'Failed to create payment intent';
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            errorMessage = `Payment gateway error (${res.status}). Please try again later.`;
          }
          throw new Error(errorMessage);
        }

        const data = await res.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load checkout'
        setError(message)
        console.error('Checkout error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCheckout()
    // Checkout reloads when auth state changes; cart helpers are read from the current render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  useEffect(() => {
    if (!clientSecret) {
      setStripePromise(null)
      return
    }

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!publishableKey) {
      setError('Payment system is not configured. Please contact support.')
      setStripePromise(null)
      return
    }

    setStripePromise(
      loadStripe(publishableKey).catch((err) => {
        console.error('Stripe load error:', err)
        setError('Payment system is unavailable right now. Please try again in a moment.')
        return null
      })
    )
  }, [clientSecret])

  const renderPage = (content: ReactNode) => (
    <>
      <Header />
      <TopBanner
        title="Checkout"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Checkout' },
        ]}
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2023/04/lademadera-collection-header.jpg"
      />
      <div className="page-content-3">
        {content}
        <Footer />
      </div>
    </>
  )

  if (authLoading || loading) {
    return renderPage(
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading checkout...</div>
      </div>
    )
  }

  if (error) {
    return renderPage(
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Checkout</h2>
          <p className={styles.errorMessage}>{error}</p>
          <Link href="/" className={styles.btnSecondary}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (!user && !clientSecret) {
    return renderPage(
      <div className={styles.container}>
        <div className={styles.authPromptContainer}>
          <h2>Secure Checkout</h2>
          <p>Please log in or create an account to complete your purchase.</p>
          <Link href="/login" className={styles.btnPrimary}>
            <span>Sign In / Create Account</span>
          </Link>
          <p className={styles.guestText}>
            or <Link href="/">continue shopping</Link>
          </p>
        </div>
      </div>
    )
  }

  if (clientSecret && !stripePromise) {
    return renderPage(
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Preparing secure payment...</div>
      </div>
    )
  }

  return renderPage(
    <div className={styles.checkoutShell}>
      <Elements stripe={stripePromise} options={{ clientSecret: clientSecret! }}>
        <CheckoutForm cartItems={cartItems} user={user} />
      </Elements>
    </div>
  )
}
