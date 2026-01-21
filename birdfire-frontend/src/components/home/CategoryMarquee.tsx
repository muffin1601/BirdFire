"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "./CategoryMarquee.module.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Category {
  title: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  { title: "Dining & Bar Chairs", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/caladio/01-stills/DF402050239IDCALADIOArmchair-incl-seat-cushionteakkapok.webp", link: "#" },
  { title: "Tables", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/cirql-nu/01-Stills/Bistro-table/DFH031702190317.webp", link: "#" },
  { title: "Lounging", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/MDEAR/01-Stills/dedon-mdear-left-corner-modulejpg.webp", link: "#" },
  { title: "Lounge Chairs", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/MDEAR/02-measurements/DHR02380205.webp", link: "#" },
  { title: "Beach Chairs", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/caladio/01-stills/DF402050239IDCALADIOArmchair-incl-seat-cushionteakkapok.webp", link: "#" },
  { title: "Iconics", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/cirql-nu/01-Stills/Bistro-table/DFH031702190317.webp", link: "#" },
  { title: "Side Tables", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/MDEAR/01-Stills/dedon-mdear-left-corner-modulejpg.webp", link: "#" },
  { title: "Lighting Accessories", image: "https://www.dedon.de/-/media/product-catalog/products/accessories/scoora/01-kollektionsbilder/DEG03170235.webp", link: "#" },
  { title: "Accessories", image: "https://www.dedon.de/-/media/product-catalog/products/furnitures/caladio/01-stills/DF402050239IDCALADIOArmchair-incl-seat-cushionteakkapok.webp", link: "#" },
];

export default function CategoryMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeHeader}>
        <h2 className={styles.sectionTitle}>SHOP BY CATEGORY</h2>

        <div className={styles.navButtons}>
          <button onClick={scrollLeft} className={styles.navBtn}>
            <ArrowLeft size={24} />
          </button>
          <button onClick={scrollRight} className={`${styles.navBtn} ${styles.active}`}>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className={styles.marqueeViewport}>
        <div className={styles.marqueeTrack}>
          {[...categories, ...categories].map((cat, index) => (
            <div key={index} className={styles.categoryCard}>
              <div className={styles.cardImage}>
                <img src={cat.image} alt={cat.title} />
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.cardTitle}>{cat.title}</span>

                <Link href={cat.link} className={styles.arrowButton}>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
