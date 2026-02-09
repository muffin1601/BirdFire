'use client'

import { Palette, PackagePlus, Sparkles } from 'lucide-react'
import styles from './HowWeWork.module.css'

export default function HowWeWork() {
  return (
    <section className={styles.wrapper}>
      <span className={styles.kicker}>How We Work</span>
      <h2 className={styles.title}>
        Designed To Feel Effortless
      </h2>

      <div className={styles.grid}>
        <Step
          icon={<Palette size={28} />}
          title="Choose a Vision"
          text="We begin by understanding how you want your outdoor space to feel and function."
        />
        <Step
          icon={<PackagePlus size={28} />}
          title="Curate the Details"
          text="Furniture, greenery, and finishes are selected with balance and longevity in mind."
        />
        <Step
          icon={<Sparkles size={28} />}
          title="Enjoy the Result"
          text="A refined outdoor space that evolves naturally with your lifestyle."
        />
      </div>
    </section>
  )
}

function Step({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  )
}
