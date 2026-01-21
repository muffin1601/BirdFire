import CategoryMarquee from "@/components/home/CategoryMarquee"
import CategoryPillMarquee from "@/components/home/CategoryPillMarquee"
import FeaturedProductsSlider from "@/components/home/ProductsSlider"
import FeaturesSection from "@/components/home/FeaturesSection"
import FurnitureGrid from "@/components/home/FurnitureGrid"
import SofaHero from "@/components/home/SofaHero"
import VideoHero from "@/components/home/VideoHero"
import Header from "@/components/layout/Header"
import FAQSection from "@/components/layout/FAQSection"
import Footer from "@/components/layout/Footer"


export default function HomePage() {
  

  return (
    <>
      <VideoHero />

      <div className="page-content">
        <Header />
        <FurnitureGrid />
        <FeaturesSection />
        <CategoryMarquee />
        <SofaHero />
        <CategoryPillMarquee />
        <FeaturedProductsSlider  />
        <FAQSection />
        <Footer />
        {/* <section style={{ height: "200vh" }}>
          
        </section> */}
      </div>
    </>
  )
}
