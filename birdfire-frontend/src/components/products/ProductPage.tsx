'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Check
} from 'lucide-react'
import { addToCart } from '@/lib/cart'
import { useFavorites } from '@/lib/useFavorites'
import styles from './ProductPage.module.css'

interface ProductImage {
  image_url: string
  sort_order: number
}

interface Product {
  id: string
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
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const vendor = 'Luxury Outdoor'
  const category = 'Outdoor Furniture'
  const tags = ['Premium', 'Outdoor', 'Designer']

  const { isFavorite, toggle } = useFavorites(product.id)

  const rating = Math.round(product.rating_average ?? 0)
  const reviewCount = product.rating_count ?? 0
  const inStock = product.stock > 0

  const increaseQty = () => {
    if (qty < product.stock) setQty(qty + 1)
  }

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1)
  }

  const handleAddToCart = () => {
    if (!inStock) return
    addToCart(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  const handleBuyNow = async () => {
    if (!inStock) return
    await addToCart(product.id, qty)
    window.location.href = '/cart'
  }

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
                {activeImage && <img src={activeImage} alt={product.name} />}
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
            ₹{product.price.toLocaleString()}
          </div>

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
            <li><strong>Vendor:</strong> {vendor}</li>
            <li><strong>Category:</strong> {category}</li>
            <li><strong>Tags:</strong> {tags.join(', ')}</li>
          </ul>

          <div className={styles.actionsWrapper}>
            <div className={styles.quantityRow}>
              <div className={styles.quantityRow2}>
                <label className={styles.qtyLabel}>Quantity:</label>

                <div className={styles.qtyBox}>
                  <button onClick={decreaseQty} disabled={qty === 1}>
                    <Minus size={14} />
                  </button>

                  <span className={styles.qtyValue}>{qty}</span>

                  <button
                    onClick={increaseQty}
                    disabled={qty === product.stock}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                className={styles.add}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                ADD TO CART
              </button>

              <button className={styles.wishlist} onClick={toggle}>
                <Heart
                  size={18}
                  fill={isFavorite ? '#ec9d35' : 'none'}
                  stroke="#ec9d35"
                />
              </button>
            </div>

            {added && (
              <div className={styles.addedMessage}>
                <Check size={14} />
                <span>Added to cart</span>
              </div>
            )}

            <button
              className={styles.buy}
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              BUY IT NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}