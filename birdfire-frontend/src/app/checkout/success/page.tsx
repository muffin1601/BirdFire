'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from './Success.module.css'
import confetti from 'canvas-confetti'

type Item = {
  quantity: number
  product: {
    name: string
    price: number
    product_images: { image_url: string; is_primary: boolean }[]
  }
}

export default function SuccessPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const clientSecret = params.get('payment_intent_client_secret')

      if (!clientSecret) {
        setLoading(false)
        return
      }

     
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret })
      })

      const data = await res.json()

      if (data.status !== 'succeeded') {
        setLoading(false)
        return
      }

      setOrderNumber(data.orderNumber)
      setOrderDate(data.created)
      setInvoiceUrl(data.invoiceUrl)

      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
        .eq('user_id', user.id)

      setItems((cart as unknown as Item[]) || [])

      
      await supabase.from('cart_items').delete().eq('user_id', user.id)

     
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 }
      })

      setLoading(false)
    }

    run()
  }, [])

  if (loading) {
    return <p className={styles.loading}>Finalizing your order…</p>
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>

        <h1 className={styles.title}>Payment successful</h1>
        <p className={styles.meta}>
          Order <strong>#{orderNumber}</strong> · {orderDate}
        </p>

        <div className={styles.items}>
          {items.map((item, i) => {
            const img =
              item.product.product_images.find(p => p.is_primary)?.image_url

            return (
              <div key={i} className={styles.item}>
                <img src={img} alt={item.product.name} />
                <div>
                  <p>{item.product.name}</p>
                  <span>Qty {item.quantity}</span>
                </div>
                <strong>
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            )
          })}
        </div>

        <div className={styles.actions}>
          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              className={styles.primaryBtn}
            >
              <span>Download invoice</span>
            </a>
          )}

          <Link href="/" className={styles.secondaryBtn}>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}