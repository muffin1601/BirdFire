'use client'

import styles from './CollectionIntro.module.css'

interface Props {
  description?: string
}

export default function CollectionIntro({ description }: Props) {
  if (!description) return null

  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        <p className={styles.description}>{description}</p>

        <div className={styles.explore}>
          <span className={styles.exploreText}>Explore Products</span>
          <span className={styles.arrow} />
        </div>
      </div>
    </section>
  )
}
