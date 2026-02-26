'use client'

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import styles from './Order.module.css'

import Header from '@/components/layout/Header'
import TopBanner from '@/components/layout/TopBanner'
import Footer from '@/components/layout/Footer'

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)

      setItems(data ?? [])
      setLoading(false)
    }

    load()
  }, [id])

  return (
    <>
      <Header />

      <TopBanner
        title="Order Details"
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2025/03/five-luxe-jbr-uae-project-header-2.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Orders', href: '/orders' },
          { label: 'Order Details' },
        ]}
      />

      <div className="page-content-3">
        <div className={styles.page}>
          <div className={styles.card}>
            <h1 className={styles.title}>Order Items</h1>

            {loading ? (
              <p className={styles.loading}>Loading order…</p>
            ) : items.length === 0 ? (
              <p className={styles.empty}>No items found.</p>
            ) : (
              <div className={styles.list}>
                {items.map(i => (
                  <div key={i.id} className={styles.item}>
                    <img src={i.image_url} alt={i.product_name} />

                    <div className={styles.info}>
                      <p>{i.product_name}</p>
                      <span>Qty {i.quantity}</span>
                    </div>

                    <strong>
                      ₹{(i.price * i.quantity).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}