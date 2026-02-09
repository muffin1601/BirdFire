// app/collections/page.tsx
import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";
import ContactMap from "@/components/contact/ContactMap";
import ContactSection from "@/components/contact/ContactSection";


export default async function ContactPage() {


  return (
    <>
      <Header />

      <TopBanner
        title="Contact Us"
        backgroundImage="https://www.ethimo.com/assets/images/headers/_HUT_Collection.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <div className="page-content-2">
      <ContactSection />  <ContactMap />
        
        <Footer />
      </div>
    </>
  );
}
