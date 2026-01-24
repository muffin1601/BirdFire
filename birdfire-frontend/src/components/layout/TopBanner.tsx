import Image from "next/image"
import Link from "next/link"
import styles from "./TopBanner.module.css"

interface Breadcrumb {
  label: string
  href?: string
}

interface TopBannerProps {
  title: string
  breadcrumbs: Breadcrumb[]
  backgroundImage: string
}

export default function TopBanner({
  title,
  breadcrumbs,
  backgroundImage
}: TopBannerProps) {
  return (
    <section className={styles.banner}>
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        priority
        className={styles.bg}
      />

      {/* Center content */}
      <div className={styles.content}>
        <h1>{title}</h1>

        <nav className={styles.breadcrumbs}>
          {breadcrumbs.map((item, i) => (
            <span key={i}>
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                item.label
              )}
              {i < breadcrumbs.length - 1 && " • "}
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
