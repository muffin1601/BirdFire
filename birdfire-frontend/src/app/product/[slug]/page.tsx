import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductPage from '@/components/products/ProductPage'
import CategoryPillMarquee from '@/components/home/CategoryPillMarquee'
import FeaturesSection from '@/components/home/FeaturesSection'
import ProductsSlider from '@/components/home/ProductsSlider'
import { supabaseServer } from '@/lib/supabaseServer'
import ProductAccordion from '@/components/products/ProductAccordion'

export async function generateStaticParams() {
  const { data: products } = await supabaseServer
    .from('products')
    .select('slug')
    .eq('is_active', true)

  return (products ?? []).map((p) => ({
    slug: p.slug,
  }))
}


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
console.log('[Product Page] slug:', slug)
  const { data: product } = await supabaseServer
    .from('products')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      price,
      compare_price,
      stock,
      availability_status,
      rating_average,
      rating_count,
      product_images (
        id,
        image_url,
        is_primary,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  console.log('[Product Page] product:', product)
console.log('[Product Page] error:', Error)

  if (!product) return notFound()

  return (
    <>
      <Header />
      <ProductPage product={product} />
      <ProductAccordion  />
      <CategoryPillMarquee />
      <FeaturesSection />
      <ProductsSlider />
      <Footer />
    </>
  )
}
