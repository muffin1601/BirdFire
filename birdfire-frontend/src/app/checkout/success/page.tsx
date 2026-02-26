'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from './Success.module.css'
import confetti from 'canvas-confetti'

export default function SuccessPage() {
  const [items, setItems] = useState<any[]>([])
  const [orderNumber, setOrderNumber] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const secret = params.get('payment_intent_client_secret')

      if (!secret) return

      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret: secret })
      })

      const data = await res.json()

      setOrderNumber(data.orderNumber)
      setOrderDate(data.created)

      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', data.orderId)

      setItems(orderItems || [])

      if (!sessionStorage.getItem('confetti')) {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
        sessionStorage.setItem('confetti', '1')
      }

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
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <img src={item.image_url} alt={item.product_name} />
              <div>
                <p>{item.product_name}</p>
                <span>Qty {item.quantity}</span>
              </div>
              <strong>
                ₹{(item.price * item.quantity).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/orders" className={styles.primaryBtn}>
            <span>Track order</span>
          </Link>

          <Link href="/" className={styles.secondaryBtn}>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}