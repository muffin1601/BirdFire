'use client'
import Link from 'next/link'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import styles from './CategoryProductsGrid.module.css'

interface Product {
  id: number | string
  handle: string
  title: string
  price: number
  rating?: number
  featured_image: string
  secondary_image?: string
  badge?: 'sale' | 'new' | 'hot' | string
  badge_text?: string
}


interface Props {
  products: Product[]
}


export default function CategoryProductsGrid({ products }: Props) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {products.map(p => (
          <Link
            key={p.id}
            href={`/product/${p.handle}`}
            className={styles.cardLink}
          >
            <div className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  className={styles.primaryImage}
                  src={p.featured_image}
                  alt={p.title}
                />

                {p.secondary_image && (
                  <img
                    className={styles.secondaryImage}
                    src={p.secondary_image}
                    alt={`${p.title} alternate`}
                  />
                )}

                {p.badge && (
                  <span className={`${styles.badge} ${styles[p.badge]}`}>
                    {p.badge_text || p.badge}
                  </span>
                )}

                <div className={styles.hoverIcons}>
                  <button
                    className={styles.iconBtn}
                    onClick={e => e.preventDefault()}
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    className={styles.iconBtn}
                    onClick={e => e.preventDefault()}
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <button
                  className={styles.cartBtn}
                  onClick={e => e.preventDefault()}
                >
                  <ShoppingBag size={18} />
                </button>
              </div>

              <div className={styles.stars}>
                {'★'.repeat(Math.round(p.rating || 4))}
                {'☆'.repeat(5 - Math.round(p.rating || 4))}
              </div>

              <h4 className={styles.productTitle}>{p.title}</h4>

              <span className={styles.price}>
                ${p.price.toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
