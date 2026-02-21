"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import styles from "./ProductsSlider.module.css"
import { ProductCard } from "../layout/ProductCard"

const PER_VIEW = 5

type Product = {
  id: string
  slug: string
  name: string
  price: number
  compare_price: number | null
  is_new: boolean
  is_featured: boolean
  primary_image: {
    image_url: string
    alt_text?: string
  } | null
  secondary_image: {
    image_url: string
    alt_text?: string
  } | null
}

export default function ProductsSlider() {
  const [products, setProducts] = useState<Product[]>([])
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          compare_price,
          is_new,
          is_featured,
          is_active,
          primary_image_id,
          product_images (
            id,
            image_url,
            alt_text,
            is_primary,
            sort_order
          )
        `)
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Featured products error:", error)
        return
      }

      const normalized: Product[] =
        data?.map((p: any) => {
          const primary =
            p.product_images?.find((img: any) => img.id === p.primary_image_id) ??
            p.product_images?.find((img: any) => img.is_primary) ??
            p.product_images
              ?.sort(
                (a: any, b: any) =>
                  (a.sort_order ?? 0) - (b.sort_order ?? 0)
              )?.[0]

          const secondary =
            p.product_images
              ?.filter((img: any) => img.id !== primary?.id)
              ?.sort(
                (a: any, b: any) =>
                  (a.sort_order ?? 0) - (b.sort_order ?? 0)
              )?.[0]

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: Number(p.price),
            compare_price: p.compare_price,
            is_new: p.is_new,
            is_featured: p.is_featured,
            primary_image: primary
              ? { image_url: primary.image_url, alt_text: primary.alt_text }
              : null,
            secondary_image: secondary
              ? { image_url: secondary.image_url, alt_text: secondary.alt_text }
              : null,
          }
        }) ?? []

      setProducts(normalized)
    }

    fetchFeaturedProducts()
  }, [])

  const maxIndex = Math.max(0, products.length - PER_VIEW)
  const next = () => setIndex((i) => Math.min(i + 1, maxIndex))
  const prev = () => setIndex((i) => Math.max(i - 1, 0))

  if (!products.length) return null

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>MOST POPULAR PRODUCTS</h2>

        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prev}>←</button>

          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === index ? styles.active : ""}`}
              />
            ))}
          </div>

          <button className={styles.navBtn} onClick={next}>→</button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * (100 / PER_VIEW)}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className={styles.slide}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}