'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

import Header from '@/components/layout/Header'
import TopBanner from '@/components/layout/TopBanner'
import Footer from '@/components/layout/Footer'

import CategoryPillMarquee from '@/components/home/CategoryPillMarquee'
import FeaturesSection from '@/components/home/FeaturesSection'
import ProductsSlider from '@/components/home/ProductsSlider'
import SearchProductsGrid from '@/components/layout/SearchProductsGrid'

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          product:products (
            id,
            name,
            slug,
            price,
            compare_price,
            is_new,
            is_featured,
            availability_status,
            primary_image_id,
            product_images (
              id,
              image_url,
              alt_text,
              is_primary,
              sort_order
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      const normalized =
        data?.map((row: any) => {
          const p = row.product
          if (!p) return null

          const primary =
            p.product_images?.find((i: any) => i.id === p.primary_image_id) ??
            p.product_images?.find((i: any) => i.is_primary) ??
            p.product_images
              ?.sort(
                (a: any, b: any) =>
                  (a.sort_order ?? 0) - (b.sort_order ?? 0)
              )?.[0]

          const secondary =
            p.product_images
              ?.filter((i: any) => i.id !== primary?.id)
              ?.sort(
                (a: any, b: any) =>
                  (a.sort_order ?? 0) - (b.sort_order ?? 0)
              )?.[0]

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            compare_price: p.compare_price,
            is_new: p.is_new,
            is_featured: p.is_featured,
            availability_status: p.availability_status,
            primary_image: primary
              ? { image_url: primary.image_url, alt_text: primary.alt_text ?? p.name }
              : null,
            secondary_image: secondary
              ? { image_url: secondary.image_url, alt_text: secondary.alt_text ?? p.name }
              : null,
          }
        }).filter(Boolean) ?? []

      setProducts(normalized)
      setLoading(false)
    }

    loadFavorites()
  }, [])

  if (loading) return null

  return (
    <>
      <Header />

      {/* HERO */}
      <TopBanner
        title="My Wishlist"
        backgroundImage="https://www.ethimo.com/assets/images/homepage/2511_contract_d.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Wishlist' },
        ]}
      />

      {/* CONTENT */}
      <div className="page-content-2">
        {products.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: 40 }}>
            You haven’t added any products to your wishlist yet.
          </p>
        )}

        {products.length > 0 && (
          <SearchProductsGrid products={products} />
        )}

        <CategoryPillMarquee />
        <FeaturesSection />
        <ProductsSlider />
      </div>

      <Footer />
    </>
  )
}