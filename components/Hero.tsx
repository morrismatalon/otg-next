import styles from '@/styles/Hero.module.css'

export default function Hero() {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <div className={styles.heroEyebrow}>
          Verified independent studios — No brands. No resellers.
        </div>
        <h1 className={styles.heroHed}>
          No brands.<br />
          <em>Only people.</em>
        </h1>
        <p className={styles.heroSub}>
          A marketplace exclusively for independent fashion designers — bedroom
          studios and small offices. Verified. Not for everyone.
        </p>
      </div>
    </section>
  )
}
