import styles from '@/styles/Statement.module.css'

export default function Statement() {
  return (
    <div className={styles.statement}>
      <div className={styles.stmtHed}>
        Not a marketplace.<br />
        <em>A record</em><br />
        of who made it.
      </div>
      <div className={styles.rules}>
        <div className={styles.rule}>
          <span className={styles.ruleN}>01</span>
          <div className={styles.ruleCopy}>
            Every designer is <strong>manually verified.</strong> Business
            classification reviewed. Customer threshold checked.
          </div>
        </div>
        <div className={styles.rule}>
          <span className={styles.ruleN}>02</span>
          <div className={styles.ruleCopy}>
            No resellers. No brands. <strong>If it scaled, it left.</strong>
          </div>
        </div>
        <div className={styles.rule}>
          <span className={styles.ruleN}>03</span>
          <div className={styles.ruleCopy}>
            Buyers know exactly where every piece came from.{' '}
            <strong>One person. One studio.</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
