import { notFound } from "next/navigation"
import Header from "@/components/layout/Header"
import TopBanner from "@/components/layout/TopBanner"

import { categories } from "@/data/categories"
import { products } from "@/data/products"
import { slugify } from "@/lib/slugify"

export const dynamicParams = false

interface PageProps {
  params: {
    category: string
  }
}

export const generateStaticParams = () => {
  return categories.map(category => ({
    category: slugify(category.label)
  }))
}

export default async function CategoryProductsPage({ params }: PageProps) {
  // ✅ unwrap params
  const { category: categorySlug } = params

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
        backgroundImage={category.image}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: category.label }
        ]}
      />

      <section className="container">
        {categoryProducts.length === 0 ? (
          <p className="empty">No products found.</p>
        ) : (
          <div className="grid">
            {categoryProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
