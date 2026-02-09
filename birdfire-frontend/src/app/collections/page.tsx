// app/collections/page.tsx
import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
import CollectionsGrid from "@/components/collections/CollectionsGrid";
import { supabaseServer } from "@/lib/supabaseServer";

async function getCollections() {
  const { data } = await supabaseServer
    .from("collections")
    .select(`
      id,
      name,
      slug,
      description,
      image_url
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <Header />

      <TopBanner
        title="Collections"
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2024/12/arena-collection-header-1.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections" },
        ]}
      />

      <div className="page-content-2">
        <CollectionsGrid collections={collections} />
        <Footer />
      </div>
    </>
  );
}
