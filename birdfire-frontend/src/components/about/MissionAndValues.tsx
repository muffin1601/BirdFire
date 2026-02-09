'use client'

import { ShieldCheck, Leaf, Ruler } from 'lucide-react'
import styles from './MissionAndValues.module.css'

export default function MissionAndValues() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Our Mission</h2>

        <p className={styles.intro}>
          To create outdoor spaces that combine lasting craftsmanship,
          refined comfort, and responsible design—built for real living.
        </p>

        <div className={styles.timeline}>
          <Value
            icon={<Ruler size={22} />}
            title="Craftsmanship"
            text="Meticulous attention to detail and material integrity in every piece."
          />
          <Value
            icon={<ShieldCheck size={22} />}
            title="Durability"
            text="Weather-resistant construction designed to endure season after season."
          />
          <Value
            icon={<Leaf size={22} />}
            title="Sustainability"
            text="Eco-conscious materials and processes that respect the environment."
          />
        </div>
      </div>
    </section>
  )
}

function Value({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className={styles.item}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.line} />
      <h4 className={styles.itemTitle}>{title}</h4>
      <p className={styles.itemText}>{text}</p>
    </div>
  )
}
