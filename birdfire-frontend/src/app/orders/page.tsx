'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import styles from './Orders.module.css'

import Header from '@/components/layout/Header'
import TopBanner from '@/components/layout/TopBanner'
import Footer from '@/components/layout/Footer'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
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
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(data ?? [])
      setLoading(false)
    }

    load()
  }, [])

  return (
    <>
      <Header />

      <TopBanner
        title="My Orders"
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2025/03/five-luxe-jbr-uae-project-header-2.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'My Orders' }
        ]}
      />

      <div className="page-content-3">
        {loading ? (
          <p className={styles.loading}>Loading orders…</p>
        ) : (
          <div className={styles.page}>
            <div className={styles.card}>
              <h1 className={styles.title}>My Orders</h1>
              <p className={styles.subtitle}>
                Track and view your recent purchases
              </p>

              {orders.length === 0 ? (
                <p className={styles.empty}>
                  You haven’t placed any orders yet.
                </p>
              ) : (
                <div className={styles.list}>
                  {orders.map(o => (
                    <Link
                      key={o.id}
                      href={`/orders/${o.id}`}
                      className={styles.order}
                    >
                      <div>
                        <strong>#{o.order_number}</strong>
                        <span className={styles.status}>
                          {o.status}
                        </span>
                      </div>

                      <span className={styles.total}>
                        ₹{o.total}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}