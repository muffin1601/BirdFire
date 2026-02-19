'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import styles from './CategoryProductsGrid.module.css'

type Product = {
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
  products: Product[]
}

export default function SearchProductsGrid({ products }: Props) {
  const [query, setQuery] = useState('')

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products

    return products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, products])

  return (
    <section className={styles.wrapper}>
     
      {/* <div style={{ marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 420,
            height: 44,
            padding: '0 16px',
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        />
      </div> */}

      
      <div className={styles.grid}>
        {filteredProducts.map((p) => {
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
              
                  {p.primary_image && (
                    <img
                      className={styles.primaryImage}
                      src={p.primary_image.image_url}
                      alt={p.primary_image.alt_text || p.name}
                    />
                  )}

           
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

                  
                  <button
                    type="button"
                    className={styles.cartBtn}
                    onClick={(e) => e.preventDefault()}
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                
                <div className={styles.stars}>★★★★☆</div>

                <h4 className={styles.productTitle}>{p.name}</h4>

                
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

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <p style={{ marginTop: 40, textAlign: 'center' }}>
          No products found
        </p>
      )}
    </section>
  )
}
