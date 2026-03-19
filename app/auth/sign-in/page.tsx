import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignInForm from '@/components/SignInForm'
import styles from '@/styles/Auth.module.css'

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.eyebrow}>Off The Grid</div>
            <h1 className={styles.headline}>
              Sign in.<br />
              <em>Welcome back.</em>
            </h1>
            <SignInForm />
            <div className={styles.alt} style={{ marginTop: 24 }}>
              No account?{' '}
              <Link href="/auth/sign-up">Apply or sign up →</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
