// app/collections/page.tsx
import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
// import CollectionsGrid from "@/components/collections/CollectionsGrid";
// import { supabaseServer } from "@/lib/supabaseServer";

import AboutIntro from "@/components/about/AboutIntro";
import AboutStorySplit from "@/components/about/AboutStorySplit";
import AboutTrustSplit from "@/components/about/AboutTrustSplit";
import HowWeWork from "@/components/about/HowWeWork";
import MissionAndValues from "@/components/about/MissionAndValues";

// async function getCollections() {
//   const { data } = await supabaseServer
//     .from("collections")
//     .select(`
//       id,
//       name,
//       slug,
//       description,
//       image_url
//     `)
//     .eq("is_active", true)
//     .order("sort_order", { ascending: true });

//   return data ?? [];
// }

export default async function AboutPage() {
//   const collections = await getCollections();

  return (
    <>
      <Header />

      <TopBanner
        title="About Us"
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2022/12/mass-collection-gallery-horizontal-11.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="page-content-2">
        {/* <CollectionsGrid collections={collections} /> */}
              <AboutIntro />
              <AboutStorySplit />
              <HowWeWork />
              <AboutTrustSplit />
              <MissionAndValues />
        <Footer />
      </div>
    </>
  );
}
