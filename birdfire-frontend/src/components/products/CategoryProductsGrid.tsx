'use client'


import styles from './CategoryProductsGrid.module.css'
import { ProductCard } from '../layout/ProductCard'

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
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
