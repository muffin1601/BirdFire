'use client'

import Link from 'next/link'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import styles from './CategoryProductsGrid.module.css'

type BackendProduct = {
  id: string
  name: string
  slug: string
  price: number
  compare_price: number | null
  is_new: boolean
  is_featured: boolean
  availability_status: string
  primary_image: {
    image_url: string
    alt_text: string
  } | null
  secondary_image: {
    image_url: string
    alt_text: string
  } | null
}

interface Props {
  products: BackendProduct[]
}

export default function CategoryProductsGrid({ products }: Props) {

  // console.log('CategoryProductsGrid products:', products)
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {products.map((p) => {
          const isOnSale =
            p.compare_price !== null && p.compare_price > p.price

          const badge = p.is_new
            ? 'new'
            : isOnSale
            ? 'sale'
            : p.is_featured
            ? 'hot'
            : undefined

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.imageWrap}>
                  {/* PRIMARY IMAGE */}
                  {p.primary_image && (
                    <img
                      className={styles.primaryImage}
                      src={p.primary_image.image_url}
                      alt={p.primary_image.alt_text || p.name}
                    />
                  )}

                  {/* SECONDARY IMAGE */}
                  {p.secondary_image && (
                    <img
                      className={styles.secondaryImage}
                      src={p.secondary_image.image_url}
                      alt={p.secondary_image.alt_text || p.name}
                    />
                  )}

                  {/* BADGE */}
                  {badge && (
                    <span className={`${styles.badge} ${styles[badge]}`}>
                      {badge === 'sale'
                        ? 'Sale'
                        : badge === 'new'
                        ? 'New'
                        : 'Hot'}
                    </span>
                  )}

                  {/* HOVER ICONS */}
                  <div className={styles.hoverIcons}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart size={18} />
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Eye size={18} />
                    </button>
                  </div>

                  {/* ADD TO CART */}
                  <button
                    type="button"
                    className={styles.cartBtn}
                    onClick={(e) => e.preventDefault()}
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                {/* RATING  */}
                <div className={styles.stars}>★★★★☆</div>

                <h4 className={styles.productTitle}>{p.name}</h4>

                {/* PRICE */}
                <div className={styles.priceWrap}>
                  {isOnSale && (
                    <span className={styles.comparePrice}>
                      ₹{p.compare_price!.toLocaleString()}
                    </span>
                  )}
                  <span className={styles.price}>
                    ₹{p.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
