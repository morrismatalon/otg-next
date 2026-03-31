import styles from '@/styles/Hero.module.css'

export default function Hero() {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
      
        <h1 className={styles.heroHed}>
          new arrivals<br />
        </h1>
     
      </div>
    </section>
  )
}
