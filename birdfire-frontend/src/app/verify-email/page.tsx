import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import styles from "./page.module.css";

export default function VerifyEmailPage() {
  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520, width: "100%" }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Verify your email
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            We’ve sent a verification link to your email address.
            <br />
            Please verify your email before logging in to your account.
          </p>

          <Link href="/login" className={styles.btnSubmit}>
            <span>Go to Login</span>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}