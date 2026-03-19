'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Designer } from '@/lib/data'
import styles from '@/styles/DesignersBrowse.module.css'

const CATEGORIES = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories']

interface Props {
  designers: Designer[]
}

export default function DesignerGrid({ designers }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLocation, setActiveLocation] = useState('All cities')

  const locations = useMemo(() => {
    const cities = Array.from(new Set(designers.map((d) => d.city))).sort()
    return ['All cities', ...cities]
  }, [designers])

  const filtered = useMemo(() => {
    return designers.filter((d) => {
      const catMatch =
        activeCategory === 'All' || d.categories.includes(activeCategory)
      const locMatch =
        activeLocation === 'All cities' || d.city === activeLocation
      return catMatch && locMatch
    })
  }, [designers, activeCategory, activeLocation])

  return (
    <>
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Category</span>
          <div className={styles.filterPills}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.pill}${activeCategory === cat ? ' ' + styles.pillActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Location</span>
          <select
            className={styles.locationSelect}
            value={activeLocation}
            onChange={(e) => setActiveLocation(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No designers match this filter.</div>
        ) : (
          filtered.map((d) => (
            <Link key={d.id} href={`/designers/${d.id}`} className={styles.designerCard}>
              <div className={styles.dInit}>{d.initials}</div>
              <div className={styles.dName}>{d.name}</div>
              <div className={styles.dMeta}>
                Studio No. {d.studioNo} · {d.city}<br />
                {d.specialty} · {d.listingCount} listings
              </div>
              <div className={styles.dStatus}>
                <div className={`${styles.dDot}${d.commissions ? '' : ' ' + styles.dDotOff}`} />
                <span className={`${styles.dDotLbl}${d.commissions ? '' : ' ' + styles.dDotLblOff}`}>
                  {d.commissions ? 'Open commissions' : 'Listings only'}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}
