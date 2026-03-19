import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getOrderById } from '@/lib/data'
import styles from '@/styles/OrderConfirmation.module.css'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const listing = order.listing

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.check}>✓</div>
          <div className={styles.eyebrow}>Request received</div>
          <h1 className={styles.headline}>
            Your request is<br />
            <em>on its way.</em>
          </h1>
          <p className={styles.body}>
            Your purchase request has been sent to the designer. They&apos;ll
            follow up at <strong>{order.buyerEmail}</strong> to confirm and
            arrange payment. Studio response time is typically 2–3 days.
          </p>

          {listing && (
            <div className={styles.orderCard}>
              <div className={styles.orderImg}>
                <Image
                  src={listing.imageSrc}
                  alt={listing.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="120px"
                />
              </div>
              <div className={styles.orderInfo}>
                <div className={styles.orderDesigner}>{listing.designer}</div>
                <div className={styles.orderName}>{listing.name}</div>
                <div className={styles.orderPrice}>{listing.price}</div>
                <div className={styles.orderCity}>{listing.city}</div>
              </div>
            </div>
          )}

          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>Order reference</span>
              <span className={styles.metaVal}>{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>Status</span>
              <span className={styles.metaVal}>Pending designer response</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>Submitted</span>
              <span className={styles.metaVal}>
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/browse" className={styles.browseLink}>
              Continue browsing
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
