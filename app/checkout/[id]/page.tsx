import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CheckoutForm from '@/components/CheckoutForm'
import { getListingById, getDesignerById } from '@/lib/data'
import styles from '@/styles/Checkout.module.css'

export default async function CheckoutPage({
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
        <Link href={`/listings/${listing.id}`} className={styles.back}>
          ← Back to listing
        </Link>

        <div className={styles.layout}>
          {/* Left — listing summary */}
          <div className={styles.summary}>
            <div className={styles.summaryImg}>
              <Image
                src={listing.imageSrc}
                alt={listing.name}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="40vw"
              />
            </div>
            <div className={styles.summaryInfo}>
              <div className={styles.summaryDesigner}>{listing.designer}</div>
              <div className={styles.summaryName}>{listing.name}</div>
              <div className={styles.summaryPrice}>{listing.price}</div>
              {designer && (
                <div className={styles.summaryStudio}>
                  Studio No. {designer.studioNo} · {listing.city}
                </div>
              )}
            </div>
          </div>

          {/* Right — form */}
          <div className={styles.formCol}>
            <div className={styles.formHeader}>
              <div className={styles.formEyebrow}>Purchase request</div>
              <h1 className={styles.formHeadline}>
                Contact the<br />
                <em>designer.</em>
              </h1>
            </div>

            <CheckoutForm listingId={listing.id} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
