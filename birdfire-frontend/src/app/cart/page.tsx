'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

import Header from '@/components/layout/Header'
import TopBanner from '@/components/layout/TopBanner'
import Footer from '@/components/layout/Footer'
import ProductsSlider from '@/components/home/ProductsSlider'

import styles from './Cart.module.css'

interface CartProductImage {
  image_url: string
  is_primary: boolean
}

interface CartProduct {
  id: string
  name: string
  price: number
  product_images: CartProductImage[]
}

interface CartPageItem {
  id: string
  quantity: number
  product: CartProduct
}

interface CartRow {
  id: string
  quantity: number
  product: CartProduct | CartProduct[] | null
}

export default function CartPage() {
  const { user, loading: authLoading } = useAuth()
  const {
    cart: localCart,
    updateCartQuantity,
    removeFromCart,
  } = useCart()

  const [items, setItems] = useState<CartPageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return

    let isMounted = true

    const loadCart = async () => {
      try {
        setLoading(true)
        setError('')

        if (!user) {
          if (localCart.length === 0) {
            if (isMounted) setItems([])
            return
          }

          const productIds = localCart.map((item) => item.productId)
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select(`
              id,
              name,
              price,
              product_images (
                image_url,
                is_primary
              )
            `)
            .in('id', productIds)

          if (productsError) throw productsError

          const guestItems = localCart.map((item) => {
            const product = products?.find((p) => p.id === item.productId)

            return {
              id: item.productId,
              quantity: item.quantity,
              product: product || {
                id: item.productId,
                name: 'Unknown Product',
                price: 0,
                product_images: [],
              },
            }
          })

          if (isMounted) setItems(guestItems as CartPageItem[])
          return
        }

        const { data, error: cartError } = await supabase
          .from('cart_items')
          .select(`
            id,
            quantity,
            product:products (
              id,
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

        const cartRows = (data || []) as unknown as CartRow[]

        if (isMounted) {
          setItems(
            cartRows
              .map((item) => ({
                id: item.id,
                quantity: item.quantity,
                product: Array.isArray(item.product) ? item.product[0] : item.product,
              }))
              .filter((item): item is CartPageItem => Boolean(item.product))
          )
        }
      } catch (e) {
        console.error('Cart load error:', e)
        if (isMounted) {
          setItems([])
          setError('We could not load your cart. Please refresh the page or try again in a moment.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCart()

    return () => {
      isMounted = false
    }
  }, [authLoading, user, localCart])

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return

    if (!user) {
      updateCartQuantity(id, qty)
      return
    }

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: qty })
      .eq('id', id)

    if (updateError) {
      setError('We could not update that item. Please try again.')
      return
    }

    setItems(items.map((item) => (item.id === id ? { ...item, quantity: qty } : item)))
  }

  const removeItem = async (id: string) => {
    if (!user) {
      removeFromCart(id)
      return
    }

    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError('We could not remove that item. Please try again.')
      return
    }

    setItems(items.filter((item) => item.id !== id))
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const renderShell = (content: ReactNode) => (
    <>
      <Header />

      <TopBanner
        title="Your Shopping Cart"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Your Shopping Cart' },
        ]}
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2023/04/lademadera-collection-header.jpg"
      />

      <div className="page-content-3">
        <div className={styles.page}>{content}</div>
        <Footer />
      </div>
    </>
  )

  if (authLoading || loading) {
    return renderShell(<p className={styles.empty}>Loading your cart...</p>)
  }

  if (error) {
    return renderShell(
      <>
        <p className={styles.empty}>{error}</p>
        <Link href="/" className={styles.btnSubmit}>
          <span>CONTINUE SHOPPING</span>
        </Link>
      </>
    )
  }

  return renderShell(
    <>
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

            {items.map((item) => {
              const image =
                item.product.product_images.find((productImage) => productImage.is_primary)?.image_url ||
                item.product.product_images[0]?.image_url ||
                '/sofa.png'

              return (
                <div key={item.id} className={styles.row}>
                  <div className={styles.product}>
                    <button
                      className={styles.remove}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 size={20} />
                    </button>
                    <img src={image} alt={item.product.name} />
                    <span>{item.product.name}</span>
                  </div>

                  <span>Rs. {item.product.price.toFixed(2)}</span>

                  <div className={styles.qty}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <span>Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              )
            })}

            <div className={styles.actions}>
              <Link href={user ? '/checkout' : '/login?next=/checkout'} className={styles.checkoutGhost}>
                PROCEED TO CHECKOUT
              </Link>

              <Link href="/" className={styles.btnSubmit}>
                <span>CONTINUE SHOPPING</span>
              </Link>
            </div>
          </div>

          <aside className={styles.summary}>
            <p className={styles.itemsCount}>
              THERE ARE {items.length} ITEMS IN YOUR CART
            </p>

            <div className={styles.summaryRow}>
              <span>TOTAL:</span>
              <strong>Rs. {total.toFixed(2)}</strong>
            </div>

            <div className={styles.summaryRowSmall}>
              <span>SHIPPING:</span>
              <span>Shipping & taxes calculated at checkout</span>
            </div>

            <div className={styles.freeShippingBox}>
              <p>CONGRATULATIONS! YOU HAVE GOT FREE SHIPPING!</p>
              <div className={styles.progressBar}>
                <span />
              </div>
              <small>Free shipping for any orders above Rs. 1000</small>
            </div>
          </aside>
        </div>
      )}

      <section className={styles.recommended}>
        <h3>You may also like these products</h3>
        <ProductsSlider />
      </section>
    </>
  )
}
