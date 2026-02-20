import Header from "@/components/layout/Header";
import TopBanner from "@/components/layout/TopBanner";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <TopBanner
        title="Account"
        backgroundImage="https://www.ethimo.com/assets/images/homepage/2511_lounge_living_d.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
      />

      <div className="page-content-3">
        {children}
      </div>

      <Footer />
    </>
  );
}