'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/lib/data'
import styles from '@/styles/Browse.module.css'
import feedStyles from '@/styles/FeedCard.module.css'

const CATEGORIES = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories', 'Footwear']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const PRICE_RANGES = [
  { label: 'All prices', min: 0, max: Infinity },
  { label: 'Under ¥20,000 / £150 / €150', min: 0, max: 150 },
  { label: '¥20k–¥50k / £150–£400 / €150–€400', min: 150, max: 500 },
  { label: 'Over ¥50,000 / £400 / €400', min: 500, max: Infinity },
]

// Normalize prices to EUR-ish for comparison
const RATES: Record<string, number> = {
  JPY: 0.0062,
  KRW: 0.00068,
  GBP: 1.17,
  EUR: 1,
  USD: 0.92,
}

function normalizePrice(price: number, currency: string): number {
  return price * (RATES[currency] ?? 1)
}

export default function BrowseGrid({
  listings,
  initialCategory,
}: {
  listings: (Listing & { currency?: string })[]
  initialCategory?: string
}) {
  const [category, setCategory] = useState(initialCategory ?? 'All')
  const [priceIdx, setPriceIdx] = useState(0)
  const [location, setLocation] = useState('All')
  const [sort, setSort] = useState('newest')

  const cities = useMemo(() => {
    const s = new Set(listings.map((l) => l.city))
    return ['All', ...Array.from(s).sort()]
  }, [listings])

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceIdx]
    let result = listings.filter((l) => {
      if (category !== 'All' && l.category !== category) return false
      if (location !== 'All' && l.city !== location) return false
      const normalized = normalizePrice(l.priceNum, 'EUR')
      if (normalized < range.min || normalized > range.max) return false
      return true
    })

    if (sort === 'newest') {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else if (sort === 'price-asc') {
      result = [...result].sort(
        (a, b) =>
          normalizePrice(a.priceNum, 'EUR') - normalizePrice(b.priceNum, 'EUR')
      )
    } else {
      result = [...result].sort(
        (a, b) =>
          normalizePrice(b.priceNum, 'EUR') - normalizePrice(a.priceNum, 'EUR')
      )
    }

    return result
  }, [listings, category, priceIdx, location, sort])

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.filterLeft}>
          <div className={styles.pills}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`${styles.pill} ${category === c ? styles.pillActive : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterRight}>
          <select
            className={styles.filterSelect}
            value={priceIdx}
            onChange={(e) => setPriceIdx(Number(e.target.value))}
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All cities' : c}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.count}>
        <span className="lbl">{filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}</span>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span>No listings match these filters.</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className={feedStyles.card}
            >
              <div className={feedStyles.cardImg}>
                <Image
                  src={listing.imageSrc}
                  alt={listing.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className={feedStyles.cardDesigner}>{listing.designer}</div>
              <div className={feedStyles.cardName}>{listing.name}</div>
              <div className={feedStyles.cardFoot}>
                <span className={feedStyles.cardPrice}>{listing.price}</span>
                <span className={feedStyles.cardCity}>{listing.city}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
