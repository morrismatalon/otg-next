import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getDesignerById, getListingsByDesigner } from '@/lib/data'
import { createBuildClient } from '@/lib/supabase/build'
import styles from '@/styles/DesignerDetail.module.css'
import feedStyles from '@/styles/FeedCard.module.css'

export async function generateStaticParams() {
  try {
    const client = createBuildClient()
    const { data } = await client.from('designers').select('id')
    return (data ?? []).map((d: { id: string }) => ({ id: d.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const designer = await getDesignerById(id)
  if (!designer) return { title: 'Designer not found' }
  return {
    title: designer.name,
    description: designer.bio.slice(0, 160),
    openGraph: {
      title: `${designer.name} — Off The Grid`,
      description: designer.bio.slice(0, 160),
      images: [{ url: '/card-1.jpg' }],
    },
  }
}

export default async function DesignerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [designer, listings] = await Promise.all([
    getDesignerById(id),
    getListingsByDesigner(id),
  ])

  if (!designer) notFound()

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <Link href="/designers" className={styles.back}>
          ← All designers
        </Link>

        <div className={styles.profile}>
          <div className={styles.profileLeft}>
            <div className={styles.dInit}>{designer.initials}</div>
            <div className={styles.dName}>{designer.name}</div>
            <div className={styles.metaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Studio</span>
                <span className={styles.metaVal}>No. {designer.studioNo}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Location</span>
                <span className={styles.metaVal}>{designer.city}, {designer.country}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Specialty</span>
                <span className={styles.metaVal}>{designer.specialty}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Listings</span>
                <span className={styles.metaVal}>{designer.listingCount}</span>
              </div>
            </div>
            <div className={styles.dStatus}>
              <div className={`${styles.dDot}${designer.commissions ? '' : ' ' + styles.dDotOff}`} />
              <span className={`${styles.dDotLbl}${designer.commissions ? '' : ' ' + styles.dDotLblOff}`}>
                {designer.commissions ? 'Open commissions' : 'Listings only'}
              </span>
            </div>
          </div>

          <div className={styles.profileRight}>
            <div className={styles.bioLabel}>About the studio</div>
            <p className={styles.bio}>{designer.bio}</p>
          </div>
        </div>

        <div className={styles.listingsSection}>
          <div className={styles.secRow}>
            <span className="lbl">Listings by {designer.name}</span>
          </div>
          <div className={styles.listingsGrid}>
            {listings.map((listing) => (
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
        </div>
      </div>

      <Footer />
    </>
  )
}
