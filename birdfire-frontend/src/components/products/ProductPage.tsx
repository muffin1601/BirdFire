'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import styles from './ProductPage.module.css'
import { Minus, Plus } from "lucide-react";

interface Props {
  product: any
}

export default function ProductPage({ product }: Props) {
  const variant = product.variants[0]

  const images = [
    product.featured_image,
    product.secondary_image,
  ].filter(Boolean) as string[]

  const [activeImage, setActiveImage] = useState(images[0])

  return (
    <section className={styles.page}>
      <div className={styles.wrapper}>
        {/* LEFT */}

        <div className={styles.gallery}>
          <div className={styles.breadcrumbs}>
            <a href="/">Home</a>
            <span>/</span>
            {/* <a href={`/products?type=${product.product_type}`}>{product.product_type}</a>
            <span>/</span> */}
            <span>{product.title}</span>
          </div>
          <div className={styles.mainImage}>
            <img src={activeImage} alt={product.title} />

            <button
              className={styles.navLeft}
              onClick={() =>
                setActiveImage(
                  images[
                  (images.indexOf(activeImage) - 1 + images.length) %
                  images.length
                  ]
                )
              }
            >
              <ChevronLeft size={22} />
            </button>

            <button
              className={styles.navRight}
              onClick={() =>
                setActiveImage(
                  images[
                  (images.indexOf(activeImage) + 1) % images.length
                  ]
                )
              }
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className={styles.thumbs}>
            {images.map(img => (
              <img
                key={img}
                src={img}
                onClick={() => setActiveImage(img)}
                className={
                  activeImage === img ? styles.activeThumb : ''
                }
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.details}>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.rating}>
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
            <span> ({product.review_count})</span>
          </div>

          <div className={styles.price}>
            ${product.price.toLocaleString()}
          </div>

          <p className={styles.desc}>{product.description}</p>

          <div className={styles.stock}>
            {variant.available ? (
              <span className={styles.in}>In stock</span>
            ) : (
              <span className={styles.out}>Out of stock</span>
            )}
          </div>

          <ul className={styles.meta}>
            <li><strong>SKU:</strong> {variant.sku}</li>
            <li><strong>Vendor:</strong> {product.vendor}</li>
            <li><strong>Category:</strong> {product.product_type}</li>
            <li><strong>Tags:</strong> {product.tags.join(', ')}</li>
          </ul>

          <div className={styles.actionsWrapper}>
            <div className={styles.quantityRow}>
              <div className={styles.quantityRow2}>
                <label className={styles.qtyLabel}>Quantity:</label>

                <div className={styles.qtyBox}>
                  <button className={styles.qtyBtn}>
                    <Minus size={14} />
                  </button>

                  <span className={styles.qtyValue}>1</span>

                  <button className={styles.qtyBtn}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>



              <button className={styles.add}>ADD TO BAG</button>

              <button className={styles.wishlist}>
                <Heart size={18} />
              </button>
            </div>

            <button className={styles.buy}>BUY IT NOW</button>
          </div>
        </div>
      </div>
    </section>
  )
}
