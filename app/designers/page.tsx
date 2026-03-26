export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DesignerGrid from '@/components/DesignerGrid'
import { getAllDesigners } from '@/lib/data'
import styles from '@/styles/DesignersBrowse.module.css'

export const metadata: Metadata = {
  title: 'All designers',
  description:
    'Browse every verified independent fashion designer on Off The Grid. Filtered by category and city. Every studio manually reviewed.',
  openGraph: {
    title: 'All designers — Off The Grid',
    description: 'Every verified independent fashion designer. No brands. Every one manually reviewed.',
    images: [{ url: '/card-1.jpg' }],
  },
}

export default async function DesignersPage() {
  const designers = await getAllDesigners()

  return (
    <>
      <Nav />

      <div className={styles.pageHead}>
        <div className={styles.eyebrow}>Verified studios</div>
        <h1 className={styles.headline}>
          All designers.<br />
          <em>Every one verified.</em>
        </h1>
      </div>

      <DesignerGrid designers={designers} />

      <Footer />
    </>
  )
}
