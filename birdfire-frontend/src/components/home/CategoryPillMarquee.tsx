"use client";

import styles from "./CategoryPillMarquee.module.css";

interface Category {
  label: string;
  icon: string;
  link: string;
}

export const categories: Category[] = [
  { label: "Dining & Bar Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/lamp.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Tables", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Lounging", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Lounge Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/armchair_beeb15d0-e4cd-4f7f-a928-00873880baed.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Beach Chairs", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Iconics", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/potted-plant.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Side Tables", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Lighting Accessories", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/coffee-table.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
  { label: "Accessories", icon: "https://nov-minicom.myshopify.com/cdn/shop/files/shelf.svg?crop=center&height=380&v=1751515294&width=380", link: "#" },
];

export default function CategoryPillMarquee() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.heading}>
        FIND THE PERFECT PIECE FOR EVERY SPACE
      </div>

      <div className={styles.marquee}>
        <div className={styles.track}>
          {[...categories, ...categories].map((cat, index) => (
            <a key={index} href={cat.link} className={styles.pill}>
              <span className={styles.icon}>
                <img src={cat.icon} alt={cat.label} />
              </span>
              <span className={styles.text}>{cat.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
