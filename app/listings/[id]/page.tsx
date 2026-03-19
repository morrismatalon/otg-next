import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getListingById, getDesignerById } from '@/lib/data'
import { createBuildClient } from '@/lib/supabase/build'
import styles from '@/styles/ListingDetail.module.css'

export async function generateStaticParams() {
  try {
    const client = createBuildClient()
    const { data } = await client.from('listings').select('id')
    return (data ?? []).map((l: { id: string }) => ({ id: l.id }))
  } catch {
    return []
  }
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  const designer = await getDesignerById(listing.designerId)

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <Link href="/designers" className={styles.back}>
          ← Back to listings
        </Link>

        <div className={styles.layout}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <Image
                src={listing.imageSrc}
                alt={listing.name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="50vw"
                priority
              />
            </div>
          </div>

          <div className={styles.detailCol}>
            <Link
              href={`/designers/${listing.designerId}`}
              className={styles.designerLink}
            >
              {listing.designer}
            </Link>

            <h1 className={styles.productName}>{listing.name}</h1>

            <div className={styles.price}>{listing.price}</div>

            <div className={styles.divider} />

            <div className={styles.descLabel}>About this piece</div>
            <p className={styles.description}>{listing.description}</p>

            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Category</span>
                <span className={styles.metaVal}>{listing.category}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Location</span>
                <span className={styles.metaVal}>{listing.city}</span>
              </div>
              {designer && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Studio</span>
                  <span className={styles.metaVal}>No. {designer.studioNo}</span>
                </div>
              )}
            </div>

            <Link
              href={`/checkout/${listing.id}`}
              className={styles.buyBtn}
            >
              Request to purchase
            </Link>

            <Link
              href={`/designers/${listing.designerId}`}
              className={styles.studioLink}
            >
              View studio →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
