import styles from '@/styles/ApplyBand.module.css'

export default function ApplyBand() {
  return (
    <div className={styles.applyBand}>
      <div className={styles.applyHed}>
        Are you making<br />
        <em>something?</em>
      </div>
      <div className={styles.applyRight}>
        <p className={styles.applySub}>
          Off The Grid is for independent designers working alone or in small
          studios. If you&apos;re under the threshold, you belong here.
        </p>
        <a href="#" className={styles.applyBtn}>Apply to sell</a>
      </div>
    </div>
  )
}
