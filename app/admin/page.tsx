import { redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignOutButton from '@/components/SignOutButton'
import AdminApproveButtons from '@/components/AdminApproveButtons'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import styles from '@/styles/Admin.module.css'
import type { DbApplication } from '@/lib/supabase/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')
  if (user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const [
    { count: designerCount },
    { count: listingCount },
    { count: pendingCount },
    { data: allApps },
  ] = await Promise.all([
    supabase.from('designers').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false }),
  ])

  const apps = (allApps ?? []) as DbApplication[]

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>Admin — Off The Grid</div>
            <h1 className={styles.headline}>
              Internal.<br />
              <em>All applications.</em>
            </h1>
          </div>
          <SignOutButton />
        </div>

        <div className={styles.body}>
          <div className={styles.tile}>
            <div className={styles.tileLabel}>Verified designers</div>
            <div className={styles.tileValue}>{designerCount ?? 0}</div>
            <div className={styles.tileSub}>Active studios</div>
          </div>
          <div className={styles.tile}>
            <div className={styles.tileLabel}>Total listings</div>
            <div className={styles.tileValue}>{listingCount ?? 0}</div>
            <div className={styles.tileSub}>Across all categories</div>
          </div>
          <div className={styles.tile}>
            <div className={styles.tileLabel}>Pending review</div>
            <div className={styles.tileValue}>{pendingCount ?? 0}</div>
            <div className={styles.tileSub}>Applications awaiting decision</div>
          </div>
        </div>

        <div className={styles.applications}>
          <div className={styles.secRow}>
            <span className="lbl">All applications</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Studio</th>
                <th>Location</th>
                <th>Volume</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontStyle: 'italic',
                      color: 'var(--faint)',
                    }}
                  >
                    No applications yet.
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id}>
                    <td>{app.name}</td>
                    <td>{app.studio_name}</td>
                    <td>{app.location}</td>
                    <td>{app.customer_volume}</td>
                    <td>
                      {new Date(app.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <AdminApproveButtons id={app.id} status={app.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  )
}
