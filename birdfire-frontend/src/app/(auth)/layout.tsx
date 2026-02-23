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
        backgroundImage="https://www.gandiablasco.com/wp-content/uploads/2025/03/five-luxe-jbr-uae-project-header-2.jpg"
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