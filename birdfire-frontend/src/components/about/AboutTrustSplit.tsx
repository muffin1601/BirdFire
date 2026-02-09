'use client'

import { ShieldCheck } from 'lucide-react'
import styles from './AboutTrustSplit.module.css'

export default function AboutTrustSplit() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.imageWrap}>
          <img
            src="https://www.ethimo.com/assets/images/headers/COL1920X9002.jpg"
            alt="Trusted outdoor living"
            className={styles.image}
          />
        </div>

        <div className={styles.text}>
          <div className={styles.icon}>
            <ShieldCheck size={26} />
          </div>

          <h3>Trusted Outdoor Living</h3>

          <p>
            From private terraces to expansive gardens, our products are
            built to withstand time, weather, and daily use.
          </p>

          <p>
            We focus on craftsmanship, material integrity, and thoughtful
            construction—so you can enjoy outdoor living without compromise.
          </p>

          <div className={styles.divider} />
        </div>
      </div>
    </section>
  )
}
