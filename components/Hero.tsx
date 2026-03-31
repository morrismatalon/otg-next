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
          Off The Grid.<br />
          <em>designers</em>
        </h1>
        <p className={styles.heroSub}>
          a marketplace for independent fashion designers
        </p>
      </div>
    </section>
  )
}
