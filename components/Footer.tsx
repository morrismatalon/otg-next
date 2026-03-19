import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <Link href="/" className={styles.ftLogo}>
          <Image
            src="/logo.png"
            alt="Off The Grid"
            width={80}
            height={20}
            style={{ mixBlendMode: 'multiply', height: 20, width: 'auto' }}
          />
        </Link>
        <div className={styles.ftTagline}>
          The record of<br />independent making.
        </div>
      </div>

      <div>
        <div className={styles.ftHead}>Platform</div>
        <ul className={styles.ftList}>
          <li><Link href="/browse">Browse listings</Link></li>
          <li><Link href="/designers">Browse designers</Link></li>
          <li><Link href="/apply">Apply to sell</Link></li>
          <li><Link href="/#how-it-works">How it works</Link></li>
        </ul>
      </div>

      <div>
        <div className={styles.ftHead}>Designers</div>
        <ul className={styles.ftList}>
          <li><Link href="/apply">Application criteria</Link></li>
          <li><Link href="/apply">Verification process</Link></li>
          <li><Link href="/apply">Seller guidelines</Link></li>
          <li><Link href="/dashboard">Studio dashboard</Link></li>
        </ul>
      </div>

      <div>
        <div className={styles.ftHead}>About</div>
        <ul className={styles.ftList}>
          <li><Link href="/">Why OTG exists</Link></li>
          <li><Link href="/apply">The threshold</Link></li>
          <li><Link href="/apply">Contact</Link></li>
        </ul>
      </div>

      <div className={styles.ftBase}>
        <span className={styles.ftCopy}>© Off The Grid 2025 — All designers verified</span>
        <span className={styles.ftCopy}>Privacy · Terms · Threshold policy</span>
      </div>
    </footer>
  )
}
