import styles from '@/styles/Skeleton.module.css'

// Homepage skeleton — feed cards + creator profiles
export default function HomeLoading() {
  return (
    <div style={{ paddingTop: 88 }}>
      {/* Hero placeholder */}
      <div className={`${styles.pulse}`} style={{ height: '100vh', width: '100%' }} />

      {/* Feed section */}
      <div className={styles.feedWrap}>
        <div className={styles.feedSecRow}>
          <div className={`${styles.pulse} ${styles.labelLine}`} />
          <div className={`${styles.pulse} ${styles.labelLine}`} />
        </div>
        <div className={styles.feedGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className={`${styles.pulse} ${styles.cardImg}`} />
              <div className={`${styles.pulse} ${styles.cardDesigner}`} />
              <div className={`${styles.pulse} ${styles.cardName}`} />
              <div className={`${styles.pulse} ${styles.cardPrice}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
