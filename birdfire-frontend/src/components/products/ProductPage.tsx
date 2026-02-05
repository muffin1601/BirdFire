'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from 'lucide-react'
import styles from './ProductPage.module.css'

interface ProductImage {
  image_url: string
  sort_order: number
}

interface Product {
  name: string
  short_description: string | null
  description: string | null
  price: number
  compare_price: number | null
  stock: number
  rating_average: number | null
  rating_count: number | null
  product_images: ProductImage[]
}

interface Props {
  product: Product
}

export default function ProductPage({ product }: Props) {
 
  const images =
    product.product_images
      ?.slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => img.image_url) ?? []

  const [activeImage, setActiveImage] = useState(images[0])

  
  const vendor = 'Luxury Outdoor'
  const category = 'Outdoor Furniture'
  const tags = ['Premium', 'Outdoor', 'Designer']
  const sku = 'SKU-0001'

  
  const rating = Math.round(product.rating_average ?? 0)
  const reviewCount = product.rating_count ?? 0
  const inStock = product.stock > 0

  return (
    <section className={styles.page}>
      <div className={styles.wrapper}>

   
        <div className={styles.gallery}>
          <div className={styles.breadcrumbs}>
            <a href="/">Home</a>
            <span>/</span>
            <span>{product.name}</span>
          </div>
<div className={styles.imageSection}>
  <div className={styles.thumbs}>
            {images.map(img => (
              <img
                key={img}
                src={img}
                onClick={() => setActiveImage(img)}
                className={activeImage === img ? styles.activeThumb : ''}
              />
            ))}
          </div>
          <div className={styles.mainImage}>
            <div className={styles.imageBox}>
              {activeImage && (
                <img src={activeImage} alt={product.name} />
              )}
            </div>

            {images.length > 1 && (
              <>
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
              </>
            )}
          </div>
          </div>
        </div>

        
        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.rating}>
            {'★'.repeat(rating)}
            {'☆'.repeat(5 - rating)}
            <span> ({reviewCount})</span>
          </div>

          
          <div className={styles.price}>
            ${product.price.toLocaleString()}
          </div>

          {/* {product.compare_price && (
            <div className={styles.compare}>
              ${product.compare_price.toLocaleString()}
            </div>
          )} */}

         
          <p className={styles.desc}>
            {product.short_description ||
              'Premium outdoor furniture designed for modern living.'}
          </p>

          
          <div className={styles.stock}>
            {inStock ? (
              <span className={styles.in}>In stock</span>
            ) : (
              <span className={styles.out}>Out of stock</span>
            )}
          </div>

      
          <ul className={styles.meta}>
            <li><strong>SKU:</strong> {sku}</li>
            <li><strong>Vendor:</strong> {vendor}</li>
            <li><strong>Category:</strong> {category}</li>
            <li><strong>Tags:</strong> {tags.join(', ')}</li>
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
