import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from '@/styles/NotFound.module.css'

export default function NotFound() {
  return (
    <>
      <Nav />
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <div className={styles.code}>404 — Page not found</div>
          <h1 className={styles.headline}>
            Nothing<br />
            <em>here.</em>
          </h1>
          <p className={styles.body}>
            The page you&apos;re looking for doesn&apos;t exist, was removed, or
            the link is wrong. Every listing and studio on Off The Grid is
            manually verified — and sometimes manually retired.
          </p>
          <div className={styles.links}>
            <Link href="/" className={styles.homeLink}>
              Back home
            </Link>
            <Link href="/browse" className={styles.browseLink}>
              Browse listings →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
