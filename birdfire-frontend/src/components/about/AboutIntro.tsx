'use client'

import styles from './AboutIntro.module.css'

export default function AboutIntro() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        {/* <p className={styles.kicker}>About Us</p> */}
        <h2 className={styles.title}>
          Designing Outdoor Spaces That Feel Like Home
        </h2>
        <p className={styles.text}>
          At Bird Fire & Outdoor, we transform outdoor environments into
          thoughtfully designed retreats. By blending comfort, durability,
          and refined aesthetics, we help you create spaces where every moment
          outdoors feels intentional.
        </p>
      </div>
    </section>
  )
}
