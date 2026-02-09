import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
// import ProductsFilterBar from "@/components/products/ProductsFilterBar";
import CategoryProductsGrid from "@/components/products/CategoryProductsGrid";
import CategoryPillMarquee from "@/components/home/CategoryPillMarquee";
import ProductsSlider from "@/components/home/ProductsSlider";
import FeaturesSection from "@/components/home/FeaturesSection";
import { supabaseServer } from "@/lib/supabaseServer";
import CollectionIntro from "@/components/collections/CollectionIntro";


export async function generateStaticParams() {
    const { data } = await supabaseServer
        .from("collections")
        .select("slug")
        .eq("is_active", true);

    return (data ?? []).map((c) => ({
        slug: c.slug,
    }));
}

async function getProducts(slug: string) {
    const { data: collection } = await supabaseServer
        .from("collections")
        .select("id, name, description")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!collection) return null;

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
        alt_text,
        is_primary,
        sort_order
      )
    `)
        .eq("collection_id", collection.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (!products) {
        return { collection, products: [] };
    }

    const normalizedProducts = products.map((p) => {
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
                ? {
                    image_url: primary.image_url,
                    alt_text: primary.alt_text ?? p.name,
                }
                : null,
            secondary_image: secondary
                ? {
                    image_url: secondary.image_url,
                    alt_text: secondary.alt_text ?? p.name,
                }
                : null,
        };
    });

    return { collection, products: normalizedProducts };
}


export default async function CollectionProductsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const result = await getProducts(slug);
    if (!result) return notFound();

    const { collection, products } = result;

    return (
        <>
            <Header />
            <TopBanner
                title={collection.name}
                backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2022/12/mass-collection-header-1.jpg"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: collection.name },
                ]}
            />
            <div className="page-content-2">
                <CollectionIntro
                    // title={collection.name}
                    description={collection.description}
                />
                {/* <ProductsFilterBar /> */}
                <CategoryProductsGrid products={products} />
                <CategoryPillMarquee />
                <FeaturesSection />
                <ProductsSlider />
                <Footer />
            </div>
        </>
    );
}