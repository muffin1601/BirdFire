'use client';

import { useRef, useState } from 'react';
import {
  Heart,
  Eye,
  ShoppingBag,
} from 'lucide-react';

import styles from './ProductsSlider.module.css';
import { featuredProducts } from '@/data/featuredProducts';

const PER_VIEW = 4;

export default function PopularProductsSlider() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const maxIndex = Math.max(0, featuredProducts.length - PER_VIEW);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  /* Swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    startX.current = null;
  };

  return (
    <section className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={styles.title}>MOST POPULAR PRODUCTS</h2>

        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prev}>←</button>
          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === index ? styles.active : ''}`}
              />
            ))}
          </div>
          <button className={styles.navBtn} onClick={next}>→</button>
        </div>
      </div>

      {/* SLIDER */}
      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.track}
          style={{
            transform: `translateX(-${index * (100 / PER_VIEW)}%)`,
          }}
        >
          {featuredProducts.map((p) => (
            <div className={styles.slide} key={p.id}>
              <div className={styles.card}>
                {/* IMAGE */}
                <div className={styles.imageWrap}>
                  <img
                    className={styles.primaryImage}
                    src={p.featured_image}
                    alt={p.title}
                  />

                  {p.secondary_image && (
                    <img
                      className={styles.secondaryImage}
                      src={p.secondary_image}
                      alt={`${p.title} alternate`}
                    />
                  )}

                  {/* BADGE */}
                  {p.badge && (
                    <span className={`${styles.badge} ${styles[p.badge]}`}>
                      {p.badge_text || p.badge}
                    </span>
                  )}

                  {/* TOP RIGHT ICONS */}
                  <div className={styles.hoverIcons}>
                    <button className={styles.iconBtn}>
                      <Heart size={18} />
                    </button>
                    <button className={styles.iconBtn}>
                      <Eye size={18} />
                    </button>
                  </div>

                  {/* ADD TO CART (BOTTOM RIGHT) */}
                  <button className={styles.cartBtn}>
                    <ShoppingBag size={18} />
                  </button>
                </div>

                {/* INFO */}
                <div className={styles.stars}>
                  {'★'.repeat(Math.round(p.rating))}
                  {'☆'.repeat(5 - Math.round(p.rating))}
                </div>

                <h4 className={styles.productTitle}>{p.title}</h4>

                <span className={styles.price}>
                  ${(p.price / 100).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
