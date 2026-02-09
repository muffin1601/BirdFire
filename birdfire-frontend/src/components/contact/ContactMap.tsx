'use client'

import styles from './ContactMap.module.css'

export default function ContactMap() {
  return (
    <section className={styles.wrapper}>
      <iframe
        src="https://www.google.com/maps?q=Toronto&output=embed"
        loading="lazy"
        className={styles.map}
      />
    </section>
  )
}
