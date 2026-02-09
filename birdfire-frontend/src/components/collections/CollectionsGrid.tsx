'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './CollectionsGrid.module.css'

type Collection = {
  id: string
  name: string
  slug: string
  image_url: string
  description?: string
}

interface Props {
  collections: Collection[]
}

export default function CollectionsGrid({ collections }: Props) {
  const [query, setQuery] = useState('')

  const filteredCollections = useMemo(() => {
    if (!query.trim()) return collections

    return collections.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, collections])

  return (
    <section className={styles.wrapper}>
      {/* SEARCH BAR */}
      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search collections"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {filteredCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collection/products/${collection.slug}`}
            className={styles.card}
          >
            <div className={styles.imageWrap}>
              <img
                src={collection.image_url}
                alt={collection.name}
                className={styles.image}
              />
            </div>

            <div className={styles.textWrap}>
              <h3 className={styles.title}>{collection.name}</h3>

              {collection.description && (
                <p className={styles.subtitle}>
                  {collection.description}
                </p>
              )}

              <span className={styles.cta}>Explore Collection</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <p className={styles.empty}>No collections found</p>
      )}
    </section>
  )
}
