"use client";

import styles from "./SofaHero.module.css";

export default function SofaHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h2>
          DISCOVER OUR SOFA COLLECTION INSPIRED BY SCANDINAVIAN SIMPLICITY
          <br />
          AND MODERN FORM, THOUGHTFULLY CRAFTED TO BRING BOTH ELEGANCE
          <br />
          AND COMFORT TO YOUR LIVING SPACE.
        </h2>

        <button className={styles.btn}>
            <span>SHOP NOW</span>
          <i className="zmdi zmdi-long-arrow-right"></i>
        </button>
      </div>

      <div className={styles.imageWrap}>
        <img
          src="/sofa.png"
          alt="Sofa"
          className={styles.sofa}
        />

        <span className={`${styles.dot} ${styles.dot1}`} />
        <span className={`${styles.dot} ${styles.dot2}`} />
        <span className={`${styles.dot} ${styles.dot3}`} />
        <span className={`${styles.dot} ${styles.dot4}`} />
      </div>
    </section>
  );
}
