import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NewListingForm from '@/components/NewListingForm'
import { createClient } from '@/lib/supabase/server'
import styles from '@/styles/NewListing.module.css'

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <Link href="/dashboard" className={styles.back}>
          ← Dashboard
        </Link>

        <div className={styles.layout}>
          <div className={styles.intro}>
            <div className={styles.eyebrow}>New listing</div>
            <h1 className={styles.headline}>
              Add a piece.<br />
              <em>Live immediately.</em>
            </h1>
            <p className={styles.body}>
              Upload a photo, add a title and price. Your listing goes live
              as soon as you submit. Keep descriptions honest and specific.
            </p>
          </div>

          <NewListingForm />
        </div>
      </div>

      <Footer />
    </>
  )
}
