'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

import Header from '@/components/layout/Header'
import TopBanner from '@/components/layout/TopBanner'
import Footer from '@/components/layout/Footer'
import ProductsSlider from '@/components/home/ProductsSlider'

import styles from './Cart.module.css'

export default function CartPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product:products (
            id,
            name,
            slug,
            price,
            product_images (
              id,
              image_url,
              is_primary,
              sort_order
            )
          )
        `)
        .eq('user_id', user.id)

      setItems(data || [])
      setLoading(false)
    }

    loadCart()
  }, [])

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return
    await supabase.from('cart_items').update({ quantity: qty }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const removeItem = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
  }

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )

  if (loading) return null

  return (
    <>
      <Header />

      <TopBanner
        title="Your Shopping Cart"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Your Shopping Cart' },
        ]}
        backgroundImage="https://www.ethimo.com/assets/images/homepage/2511_lounge_living_d.jpg"
      />
<div className="page-content-2">
      <div className={styles.page}>
        {items.length === 0 ? (
          <p className={styles.empty}>Your cart is empty.</p>
        ) : (
          <div className={styles.layout}>
            <div className={styles.cart}>
              <div className={styles.head}>
                <span>Product</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
              </div>

              {items.map(item => {
                const image =
                  item.product.product_images.find((i: any) => i.is_primary)?.image_url

                return (
                  <div key={item.id} className={styles.row}>
                    <div className={styles.product}>
                      <button
                        className={styles.remove}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>

                      <img src={image} alt={item.product.name} />
                      <span>{item.product.name}</span>
                    </div>

                    <span>€{item.product.price.toFixed(2)}</span>

                    <div className={styles.qty}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>

                    <span>
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                )
              })}

              <div className={styles.actions}>
                <Link href="/checkout" className={styles.checkoutGhost}>
                  PROCEED TO CHECKOUT
                </Link>

                <Link href="/" className={styles.btnSubmit}>
                  <span>CONTINUE SHOPPING</span>
                </Link>
              </div>
            </div>

            <aside className={styles.summary}>
              <h4>There are {items.length} items in your cart</h4>

              <div className={styles.totalRow}>
                <span>Total:</span>
                <strong>€{total.toFixed(2)}</strong>
              </div>

              <p className={styles.shipping}>
                Shipping & taxes calculated at checkout
              </p>

              <div className={styles.free}>
                Congratulations! You’ve got free shipping.
              </div>
            </aside>
          </div>
        )}

        <section className={styles.recommended}>
          <h3>You may also like these products</h3>
          <ProductsSlider />
        </section>
      </div>

      <Footer />
      </div>
    </>
  )
}