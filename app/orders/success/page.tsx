import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getOrderByStripeSessionId } from '@/lib/data'
import styles from '@/styles/OrderConfirmation.module.css'

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  if (!session_id) notFound()

  const order = await getOrderByStripeSessionId(session_id)
  if (!order) {
    // Webhook may not have fired yet — show a generic success
    return (
      <>
        <Nav />
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <div className={styles.check}>✓</div>
            <div className={styles.eyebrow}>Payment confirmed</div>
            <h1 className={styles.headline}>
              Your order is<br />
              <em>confirmed.</em>
            </h1>
            <p className={styles.body}>
              Your payment was successful. The designer will be in touch
              to confirm details and arrange shipping.
            </p>
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

  const listing = order.listing

  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.check}>✓</div>
          <div className={styles.eyebrow}>Payment confirmed</div>
          <h1 className={styles.headline}>
            Your order is<br />
            <em>confirmed.</em>
          </h1>
          <p className={styles.body}>
            Your payment was successful. A confirmation has been sent to{' '}
            <strong>{order.buyerEmail}</strong>. The designer will be in
            touch to confirm details and arrange shipping.
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
              <span className={styles.metaVal}>Confirmed</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>Date</span>
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
