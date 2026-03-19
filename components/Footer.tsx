import Image from 'next/image'
import styles from '@/styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <a href="#" className={styles.ftLogo}>
          <Image
            src="/logo.png"
            alt="Off The Grid"
            width={80}
            height={20}
            style={{ mixBlendMode: 'multiply', height: 20, width: 'auto' }}
          />
        </a>
        <div className={styles.ftTagline}>
          The record of<br />independent making.
        </div>
      </div>

      <div>
        <div className={styles.ftHead}>Platform</div>
        <ul className={styles.ftList}>
          <li><a href="#">Browse listings</a></li>
          <li><a href="#">Browse designers</a></li>
          <li><a href="#">Apply to sell</a></li>
          <li><a href="#">How it works</a></li>
        </ul>
      </div>

      <div>
        <div className={styles.ftHead}>Designers</div>
        <ul className={styles.ftList}>
          <li><a href="#">Application criteria</a></li>
          <li><a href="#">Verification process</a></li>
          <li><a href="#">Seller guidelines</a></li>
          <li><a href="#">Studio dashboard</a></li>
        </ul>
      </div>

      <div>
        <div className={styles.ftHead}>About</div>
        <ul className={styles.ftList}>
          <li><a href="#">Why OTG exists</a></li>
          <li><a href="#">The threshold</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <div className={styles.ftBase}>
        <span className={styles.ftCopy}>© Off The Grid 2025 — All designers verified</span>
        <span className={styles.ftCopy}>Privacy · Terms · Threshold policy</span>
      </div>
    </footer>
  )
}
