import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
import CategoryPillMarquee from "@/components/home/CategoryPillMarquee";
import ProductsSlider from "@/components/home/ProductsSlider";
import FeaturesSection from "@/components/home/FeaturesSection";
import SearchProductsGrid from "@/components/layout/SearchProductsGrid";

async function searchProducts(query: string) {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data.map((p: any) => {
    let primary =
      p.product_images?.find((img: any) => img.id === p.primary_image_id) ??
      p.product_images?.find((img: any) => img.is_primary) ??
      p.product_images?.sort(
        (a: any, b: any) => a.sort_order - b.sort_order
      )?.[0];

    let secondary =
      p.product_images?.find((img: any) => img.id === p.secondary_image_id) ??
      p.product_images
        ?.filter((img: any) => img.id !== primary?.id)
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0];

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
    };
  });
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = await searchProducts(query);

  return (
    <>
      <Header />

      <TopBanner
        title={query ? `Search results for “${query}”` : "Search Products"}
        backgroundImage="https://www.ethimo.com/assets/images/homepage/2511_lounge_living_d.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Search" },
          ...(query ? [{ label: query }] : []),
        ]}
      />

      <div className="page-content-2">
        <SearchProductsGrid products={products} />
        <CategoryPillMarquee />
        <FeaturesSection />
        <ProductsSlider />
        <Footer />
      </div>
    </>
  );
}
