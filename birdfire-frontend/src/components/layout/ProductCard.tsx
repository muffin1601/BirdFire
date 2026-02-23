'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { useFavorites } from '@/lib/useFavorites'
import { addToCart } from '@/lib/cart'
import styles from './CategoryProductsGrid.module.css'
import { useState } from 'react'

export function ProductCard({ product }: { product: any }) {
  const { isFavorite, toggle } = useFavorites(product.id)
  const [added, setAdded] = useState(false)

  const isOnSale =
    product.compare_price !== null &&
    product.compare_price > product.price

  const badge = product.is_new
    ? 'new'
    : isOnSale
    ? 'sale'
    : product.is_featured
    ? 'hot'
    : undefined

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product.id)
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
              ₹{product.compare_price.toLocaleString()}
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