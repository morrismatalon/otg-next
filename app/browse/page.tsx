import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BrowseGrid from '@/components/BrowseGrid'
import { getAllListings } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import styles from '@/styles/Browse.module.css'

export const metadata: Metadata = {
  title: 'Browse listings',
  description:
    'Browse all listings from verified independent fashion designers on Off The Grid. Filter by category, price, and location.',
  openGraph: {
    title: 'Browse listings — Off The Grid',
    description: 'All listings from verified independent designers. Filter by category, price, and city.',
    images: [{ url: '/card-2.jpg' }],
  },
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const listings = await getAllListings()

  // Get currency info per listing (we stored priceNum, need currency for sort)
  const supabase = await createClient()
  const { data: rawListings } = await supabase
    .from('listings')
    .select('id, currency')

  const currencyMap: Record<string, string> = {}
  for (const r of rawListings ?? []) {
    currencyMap[r.id] = r.currency
  }

  const listingsWithCurrency = listings.map((l) => ({
    ...l,
    currency: currencyMap[l.id] ?? 'EUR',
  }))

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Browse — Off The Grid</div>
          <h1 className={styles.headline}>
            All listings.<br />
            <em>Every studio.</em>
          </h1>
        </div>

        <BrowseGrid
          listings={listingsWithCurrency}
          initialCategory={category ?? 'All'}
        />
      </div>

      <Footer />
    </>
  )
}
