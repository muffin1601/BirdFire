'use client'

import { Sparkles } from 'lucide-react'
import styles from './AboutStorySplit.module.css'

export default function AboutStorySplit() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.imageWrap}>
          <img
            src="https://www.ethimo.com/assets/images/homepage/2511_contract_d.jpg"
            alt="Outdoor living"
            className={styles.image}
          />
        </div>

        <div className={styles.text}>
          <span className={styles.kicker}>
            {/* <Sparkles size={14} /> */}
            Design Philosophy
          </span>

          <h3>Outdoor Living, Reimagined</h3>

          <p>
            Our collections combine refined furniture, sculptural greenery,
            and thoughtful materials to create inviting outdoor environments.
          </p>

          <p>
            Every piece is designed to endure the elements while maintaining
            comfort and visual harmony.
          </p>

          <div className={styles.divider} />
        </div>
      </div>
    </section>
  )
}
