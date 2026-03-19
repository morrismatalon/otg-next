import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getDesignerById, getListingsByDesigner } from '@/lib/data'
import { createBuildClient } from '@/lib/supabase/build'
import styles from '@/styles/Studio.module.css'
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
  if (!designer) return { title: 'Studio not found' }
  return {
    title: `${designer.name} — Studio No. ${designer.studioNo}`,
    description: designer.bio.slice(0, 160),
    openGraph: {
      title: `${designer.name} — Off The Grid`,
      description: designer.bio.slice(0, 160),
      images: [{ url: '/card-1.jpg' }],
    },
  }
}

export default async function StudioPage({
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
          ← All studios
        </Link>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.avatar}>{designer.initials}</div>
            <div className={styles.studioLabel}>Studio number</div>
            <div className={styles.studioNo}>No. {designer.studioNo}</div>
          </div>
          <div className={styles.heroRight}>
            <h1 className={styles.name}>{designer.name}</h1>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}>
                <b>{designer.city}</b>
              </span>
              <span className={styles.dot} />
              <span className={styles.heroMetaItem}>
                <b>{designer.country}</b>
              </span>
              <span className={styles.dot} />
              <span className={styles.heroMetaItem}>
                {designer.specialty}
              </span>
              <span className={styles.dot} />
              <span className={styles.heroMetaItem}>
                <b>{designer.listingCount}</b> listing{designer.listingCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className={styles.about}>
          <div className={styles.metaCol}>
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

            <div className={styles.status}>
              <div className={`${styles.statusDot}${designer.commissions ? '' : ' ' + styles.statusDotOff}`} />
              <span className={`${styles.statusLbl}${designer.commissions ? '' : ' ' + styles.statusLblOff}`}>
                {designer.commissions ? 'Open commissions' : 'Listings only'}
              </span>
            </div>

            {designer.instagram && (
              <a
                href={`https://instagram.com/${designer.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagram}
              >
                {designer.instagram} ↗
              </a>
            )}
          </div>

          <div className={styles.bioCol}>
            <div className={styles.bioLabel}>About the studio</div>
            <p className={styles.bio}>{designer.bio}</p>
          </div>
        </div>

        {/* Listings */}
        <div className={styles.listings}>
          <div className={styles.secRow}>
            <span className="lbl">Listings by {designer.name}</span>
            <span className={styles.listingCount}>
              {listings.length} piece{listings.length !== 1 ? 's' : ''}
            </span>
          </div>

          {listings.length === 0 ? (
            <div className={styles.empty}>No listings yet.</div>
          ) : (
            <div className={styles.grid}>
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
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
