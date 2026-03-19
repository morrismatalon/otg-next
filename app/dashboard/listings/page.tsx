import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignOutButton from '@/components/SignOutButton'
import ListingManager from '@/components/ListingManager'
import { createClient } from '@/lib/supabase/server'
import { getDesignerByUserId, getListingsByDesigner } from '@/lib/data'
import { ADMIN_EMAIL } from '@/lib/constants'
import styles from '@/styles/Dashboard.module.css'

export default async function DashboardListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')
  if (user.email === ADMIN_EMAIL) redirect('/admin')

  const designer = await getDesignerByUserId(user.id)
  if (!designer) redirect('/dashboard')

  const listings = await getListingsByDesigner(designer.id)

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>Manage listings</div>
            <h1 className={styles.headline}>
              {designer.name}.<br />
              <em>Your work.</em>
            </h1>
          </div>
          <SignOutButton />
        </div>

        <div className={styles.applications}>
          <div className={styles.secRow}>
            <span className="lbl">
              {listings.length} listing{listings.length !== 1 ? 's' : ''}
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/dashboard" className={styles.cancelBtn ?? ''} style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.19em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                padding: '10px 0',
              }}>
                ← Dashboard
              </Link>
              <Link href="/dashboard/new-listing" className={styles.newBtn}>
                + New listing
              </Link>
            </div>
          </div>

          <ListingManager listings={listings} />
        </div>
      </div>

      <Footer />
    </>
  )
}
