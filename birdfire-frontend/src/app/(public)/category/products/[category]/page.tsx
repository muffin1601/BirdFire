import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
import ProductsFilterBar from "@/components/products/ProductsFilterBar";
import CategoryProductsGrid from "@/components/products/CategoryProductsGrid";
import CategoryPillMarquee from "@/components/home/CategoryPillMarquee";
import FeaturedProductsSlider from "@/components/home/ProductsSlider";
import FeaturesSection from "@/components/home/FeaturesSection";
import { supabaseServer } from "@/lib/supabaseServer";

export async function generateStaticParams() {
  const { data } = await supabaseServer
    .from("categories")
    .select("slug")
    .eq("is_active", true);

  return (data ?? []).map((c) => ({
    category: c.slug,
  }));
}

async function getProducts(slug: string) {
  const { data: category } = await supabaseServer
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!category) return [];

  const { data: products } = await supabaseServer
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      compare_price,
      is_new,
      is_featured,
      availability_status,
      primary_image_id,
      secondary_image_id,
      product_images (
        id,
        image_url,
        alt_text
      )
    `)
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!products) return [];

  return products.map((p) => {
  const primary = p.product_images?.find(
    (img: any) => img.id === p.primary_image_id
  )

  const secondary = p.product_images?.find(
    (img: any) => img.id === p.secondary_image_id
  )

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
      ? {
          image_url: primary.image_url,
          alt_text: primary.alt_text ?? p.name,
        }
      : undefined,
    secondary_image: secondary
      ? {
          image_url: secondary.image_url,
          alt_text: secondary.alt_text ?? p.name,
        }
      : undefined,
  }
})

}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  const products = await getProducts(category)

  if (!products.length) return notFound()

  return (
    <>
      <Header />

      <TopBanner
        title={category.toUpperCase()}
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2025/07/private-house-korea-bundang-district-project-header.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: category },
        ]}
      />

      <div className="page-content-2">
        <ProductsFilterBar />
        <CategoryProductsGrid products={products} />
        <CategoryPillMarquee />
        <FeaturesSection />
        <FeaturedProductsSlider />
        <Footer />
      </div>
    </>
  )
}
