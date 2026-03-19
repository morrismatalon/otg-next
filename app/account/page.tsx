import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { createBuildClient } from '@/lib/supabase/build'
import { signOut } from '@/app/auth/actions'
import styles from '@/styles/Account.module.css'

export const metadata: Metadata = {
  title: 'Account',
  description: 'Your Off The Grid account — order history and profile.',
}

function emailInitials(email: string): string {
  const local = email.split('@')[0]
  const parts = local.split(/[._\-+]/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return local.slice(0, 2).toUpperCase()
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const db = createBuildClient()

  // Fetch orders placed by this user
  const { data: orderRows } = await db
    .from('orders')
    .select('id, listing_id, status, created_at, listings(title, price_display, designer_id, designers(name))')
    .eq('buyer_email', user.email!)
    .order('created_at', { ascending: false })

  // Check if this user is a verified seller
  const { data: designerRow } = await db
    .from('designers')
    .select('id, name, studio_number')
    .eq('user_id', user.id)
    .maybeSingle()

  const orders = orderRows ?? []
  const initials = emailInitials(user.email ?? 'ME')

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroInfo}>
            <div className={styles.eyebrow}>Account — Off The Grid</div>
            <div className={styles.heroEmail}>{user.email}</div>
            <div className={styles.heroActions}>
              {designerRow && (
                <Link href="/dashboard" className={styles.heroLink}>
                  Studio dashboard →
                </Link>
              )}
              <form className={styles.signOutForm} action={signOut}>
                <button type="submit" className={styles.signOutBtn}>
                  Sign out →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Seller band — only for verified sellers */}
        {designerRow && (
          <div className={styles.sellerBand}>
            <span className={styles.sellerBandText}>
              Studio No. {designerRow.studio_number} — {designerRow.name}
            </span>
            <Link href="/dashboard" className={styles.sellerBandLink}>
              Manage listings →
            </Link>
          </div>
        )}

        {/* Order history */}
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Order history</div>

            {orders.length === 0 ? (
              <div className={styles.empty}>No orders yet.</div>
            ) : (
              orders.map((order) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const listing = order.listings as any
                const listingTitle = listing?.title ?? 'Listing removed'
                const priceDisplay = listing?.price_display ?? ''
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const designerName = (listing?.designers as any)?.name ?? ''

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className={styles.orderLink}
                  >
                    <div className={styles.orderRow}>
                      <div>
                        <div className={styles.orderName}>{listingTitle}</div>
                        {designerName && (
                          <div className={styles.orderMeta}>{designerName}</div>
                        )}
                      </div>
                      <div className={styles.orderStatus}>
                        {priceDisplay && <span style={{ marginRight: 16, color: 'var(--ink)' }}>{priceDisplay}</span>}
                        {order.status}
                      </div>
                      <div className={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
