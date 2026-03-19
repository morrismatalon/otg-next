import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignOutButton from '@/components/SignOutButton'
import { createClient } from '@/lib/supabase/server'
import { getDesignerByUserId, getListingsByDesigner } from '@/lib/data'
import { ADMIN_EMAIL } from '@/lib/constants'
import styles from '@/styles/Dashboard.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  // Admins go to /admin
  if (user.email === ADMIN_EMAIL) redirect('/admin')

  const designer = await getDesignerByUserId(user.id)
  const listings = designer ? await getListingsByDesigner(designer.id) : []

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>Seller dashboard</div>
            <h1 className={styles.headline}>
              {designer ? designer.name : 'Your Studio'}.<br />
              <em>{designer ? `No. ${designer.studioNo}` : 'Pending.'}</em>
            </h1>
          </div>
          <SignOutButton />
        </div>

        {!designer ? (
          <div className={styles.noProfile}>
            <div className={styles.noProfileLabel}>No seller profile found</div>
            <p className={styles.noProfileText}>
              Your account isn&apos;t linked to a verified designer profile yet.
              If you applied, we&apos;ll follow up within 5–7 days.
            </p>
            <Link href="/apply" className={styles.applyLink}>
              Apply to sell →
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.body}>
              <div className={styles.tile}>
                <div className={styles.tileLabel}>Verification</div>
                <div className={`${styles.tileValue} ${designer.verified ? '' : styles.tileValueMuted}`}>
                  {designer.verified ? 'Verified' : 'Pending'}
                </div>
                <div className={styles.tileSub}>
                  {designer.verified ? 'Active seller' : 'Under review'}
                </div>
              </div>
              <div className={styles.tile}>
                <div className={styles.tileLabel}>Studio number</div>
                <div className={styles.tileValue}>No. {designer.studioNo}</div>
                <div className={styles.tileSub}>{designer.city}, {designer.country}</div>
              </div>
              <div className={styles.tile}>
                <div className={styles.tileLabel}>Total listings</div>
                <div className={styles.tileValue}>{designer.listingCount}</div>
                <div className={styles.tileSub}>{designer.specialty}</div>
              </div>
            </div>

            <div className={styles.applications}>
              <div className={styles.secRow}>
                <span className="lbl">Your listings</span>
                <Link href="/dashboard/new-listing" className={styles.newBtn}>
                  + New listing
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No listings yet. Add your first piece.</p>
                  <Link href="/dashboard/new-listing" className={styles.emptyBtn}>
                    Create a listing
                  </Link>
                </div>
              ) : (
                <div className={styles.listingsGrid}>
                  {listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className={styles.listingCard}
                    >
                      <div className={styles.listingImg}>
                        <Image
                          src={listing.imageSrc}
                          alt={listing.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className={styles.listingName}>{listing.name}</div>
                      <div className={styles.listingMeta}>
                        <span>{listing.price}</span>
                        <span>{listing.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  )
}
