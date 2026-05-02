import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductPage from '@/components/products/ProductPage'
import CategoryPillMarquee from '@/components/home/CategoryPillMarquee'
import FeaturesSection from '@/components/home/FeaturesSection'
import ProductsSlider from '@/components/home/ProductsSlider'
import { supabaseServer } from '@/lib/supabaseServer'
import ProductAccordion from '@/components/products/ProductAccordion'

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  // Try fetching with brands relationship
  let { data: product, error } = await supabaseServer
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
      ),
      brands (
        name,
        logo_url
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as any;

  // Fallback if brand relationship fails
  if (error && error.message.includes('relationship')) {
    console.warn('[Product Page] Brand relationship missing, falling back...');
    const { data: fallbackData, error: fallbackError } = await supabaseServer
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
      .single() as any;
      
    product = fallbackData;
    if (fallbackError) console.error('[Product Page] Fallback error:', fallbackError);
  } else if (error) {
    console.error('[Product Page] Query error:', error);
  }

  if (!product) return notFound()

  return (
    <>
      <Header />
      <ProductPage product={product as any} />
      <ProductAccordion />
      <CategoryPillMarquee />
      <FeaturesSection />
      <ProductsSlider />
      <Footer />
    </>
  )
}
