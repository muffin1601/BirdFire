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
  primary_image?: {
    image_url: string
    alt_text: string
  }
  secondary_image?: {
    image_url: string
    alt_text: string
  }
}

interface Props {
  products: BackendProduct[]
}

export default function CategoryProductsGrid({ products }: Props) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {products.map(p => {
          const badge =
            p.is_new
              ? 'new'
              : p.compare_price
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
                  <img
                    className={styles.primaryImage}
                    src={p.primary_image?.image_url || ''}
                    alt={p.primary_image?.alt_text || p.name}
                  />

                  {p.secondary_image && (
                    <img
                      className={styles.secondaryImage}
                      src={p.secondary_image.image_url}
                      alt={p.secondary_image.alt_text || p.name}
                    />
                  )}

                  {badge && (
                    <span className={`${styles.badge} ${styles[badge]}`}>
                      {badge === 'sale'
                        ? 'Sale'
                        : badge === 'new'
                        ? 'New'
                        : 'Hot'}
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
                  {'★★★★☆'}
                </div>

                <h4 className={styles.productTitle}>{p.name}</h4>

                <span className={styles.price}>
                  ${p.price.toLocaleString()}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
