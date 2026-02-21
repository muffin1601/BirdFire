'use client'

import { useState, useMemo } from 'react'

import styles from './CategoryProductsGrid.module.css'
import { ProductCard } from '../layout/ProductCard'

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
      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ marginTop: 40, textAlign: 'center' }}>
          No products found
        </p>
      )}
    </section>
  )
}
