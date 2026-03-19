import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SignUpForm from '@/components/SignUpForm'
import styles from '@/styles/Auth.module.css'

export default function SignUpPage() {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.eyebrow}>Off The Grid</div>
            <h1 className={styles.headline}>
              Create account.<br />
              <em>Already a designer?</em>
            </h1>
            <SignUpForm />
            <div className={styles.alt} style={{ marginTop: 24 }}>
              Have an account?{' '}
              <Link href="/auth/sign-in">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
