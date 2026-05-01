'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { useFavorites } from '@/lib/useFavorites'
import { useCart } from '@/lib/useCart'
import styles from './CategoryProductsGrid.module.css'
import { useState } from 'react'

interface ProductCardProduct {
  id: string
  slug: string
  name: string
  price: number
  compare_price: number | null
  is_new?: boolean
  is_featured?: boolean
  primary_image?: {
    image_url: string
    alt_text?: string | null
  } | null
  secondary_image?: {
    image_url: string
    alt_text?: string | null
  } | null
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const { isFavorite, toggle } = useFavorites(product.id)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const comparePrice = product.compare_price
  const isOnSale =
    typeof comparePrice === 'number' &&
    comparePrice > product.price

  const badge = product.is_new
    ? 'new'
    : isOnSale
    ? 'sale'
    : product.is_featured
    ? 'hot'
    : undefined

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    await addToCart(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Link href={`/product/${product.slug}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          {product.primary_image && (
            <img
              className={styles.primaryImage}
              src={product.primary_image.image_url}
              alt={product.primary_image.alt_text || product.name}
            />
          )}

          {product.secondary_image && (
            <img
              className={styles.secondaryImage}
              src={product.secondary_image.image_url}
              alt={product.secondary_image.alt_text || product.name}
            />
          )}

          {badge && (
            <span className={`${styles.badge} ${styles[badge]}`}>
              {badge === 'sale' ? 'Sale' : badge === 'new' ? 'New' : 'Hot'}
            </span>
          )}

          <div className={styles.hoverIcons}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={(e) => {
                e.preventDefault()
                toggle()
              }}
            >
              <Heart
                size={18}
                fill={isFavorite ? '#ec9d35' : 'none'}
                stroke={isFavorite ? '#ec9d35' : 'currentColor'}
              />
            </button>
          </div>

          <button
            type="button"
            className={`${styles.cartBtn} ${added ? styles.cartAdded : ''}`}
            onClick={handleAddToCart}
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>

          {added && (
            <div className={styles.addedLabel}>
              Added to cart
            </div>
          )}
        </div>

        <div className={styles.stars}>★★★★☆</div>
        <h4 className={styles.productTitle}>{product.name}</h4>

        <div className={styles.priceWrap}>
          {isOnSale && (
            <span className={styles.comparePrice}>
              ₹{comparePrice.toLocaleString()}
            </span>
          )}
          <span className={styles.price}>
            ₹{product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  )
}
