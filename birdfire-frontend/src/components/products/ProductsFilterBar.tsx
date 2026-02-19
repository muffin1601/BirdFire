'use client'

import {
  SlidersHorizontal,
  ChevronDown,
  Trash2,
} from 'lucide-react'

import styles from './ProductsFilterBar.module.css'

export default function ProductsFilterBar() {
  return (
    <section className={styles.wrapper}>
      
      <div className={styles.top}>
        <span className={styles.filterLabel}>
          <SlidersHorizontal size={16} />
          FILTER BY
        </span>
      </div>

      
      <div className={styles.filters}>
        {['Availability', 'Brand', 'Color', 'More Filters', 'Product Type'].map(
          item => (
            <button
              key={item}
              className={`${styles.filterBtn} ${
                item === 'Color' ? styles.active : ''
              }`}
            >
              {item}
              <ChevronDown size={14} />
            </button>
          )
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.clearBtn}>
          <span><Trash2 size={14} />
          CLEAR ALL</span>
        </button>

        <div className={styles.right}>
          <div className={styles.sort}>
            Sort by <strong>Featured</strong>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </section>
  )
}
