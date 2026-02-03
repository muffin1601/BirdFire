import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { featuredProducts } from '@/data/featuredProducts'
import ProductPage from '@/components/products/ProductPage'
import ProductAccordion from '@/components/products/ProductAccordion'
import CategoryPillMarquee from '@/components/home/CategoryPillMarquee'
import FeaturesSection from '@/components/home/FeaturesSection'
import FeaturedProductsSlider from '@/components/home/ProductsSlider'

export const dynamicParams = false

interface PageProps {
  params: {
    handle: string
  }
}

export function generateStaticParams() {
  return featuredProducts.map(product => ({
    handle: product.handle,
  }))
}

export default async function Page({ params }: PageProps) {

  const { handle } = await params

  const product = featuredProducts.find(
    p => p.handle === handle
  )

  if (!product) return notFound()

  return (
    <>
      <Header />
      <ProductPage product={product} />
      <ProductAccordion />
      <CategoryPillMarquee />
      <FeaturesSection />
      <FeaturedProductsSlider />
      <Footer />
    </>
  )
}
