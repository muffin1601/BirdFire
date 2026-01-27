import { notFound } from "next/navigation"
import Header from "@/components/layout/Header"
import TopBanner from "@/components/layout/TopBanner"

import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { slugify } from "@/lib/slugify"
// import { i } from "framer-motion/client"
import Footer from "@/components/layout/Footer"
import CategoryProductsGrid from "@/components/products/CategoryProductsGrid"
import { featuredProducts } from "@/data/featuredProducts"
import ProductsFilterBar from "@/components/products/ProductsFilterBar"
import CategoryPillMarquee from "@/components/home/CategoryPillMarquee"
import FeaturedProductsSlider from "@/components/home/ProductsSlider"
import FeaturesSection from "@/components/home/FeaturesSection"

export const dynamicParams = false

interface PageProps {
  params: Promise<{
    category: string
  }>
}

export const generateStaticParams = async () => {
  return categories.map(category => ({
    category: slugify(category.label)
  }))
}

export default async function CategoryProductsPage({ params }: PageProps) {
  // IMPORTANT: await params (Next.js App Router requirement)
  const { category: categorySlug } = await params

  const category = categories.find(
    c => slugify(c.label) === categorySlug
  )

  if (!category) return notFound()

  const categoryProducts = products.filter(
    product => product.category === categorySlug
  )

  return (
    <>
      <Header />

      <TopBanner
        title={category.label.toUpperCase()}
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2025/07/private-house-korea-bundang-district-project-header.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: category.label }
        ]}
      />

      <div className="page-content-2">

        <ProductsFilterBar />
        <CategoryProductsGrid products={featuredProducts} />
        <CategoryPillMarquee />
        <FeaturesSection />
        <FeaturedProductsSlider />
        
        <Footer />
      </div>

    </>
  )
}
