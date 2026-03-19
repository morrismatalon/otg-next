import styles from '@/styles/HowItWorks.module.css'

const steps = [
  {
    step: 'Step 01',
    title: 'Apply',
    copy: 'Submit your studio profile, business classification, and customer volume.',
  },
  {
    step: 'Step 02',
    title: 'Review',
    copy: 'Manual review by the OTG team. Typically 5–7 days. Everything checked by hand.',
  },
  {
    step: 'Step 03',
    title: 'Studio number',
    copy: 'Approved designers receive a permanent studio number. It stays with you, not your listings.',
  },
  {
    step: 'Annual',
    title: 'Re-verification',
    copy: 'Threshold re-checked yearly. Growth beyond limits means a graceful exit.',
  },
]

export default function HowItWorks() {
  return (
    <>
      <div className={styles.secRow}>
        <span className="lbl">How verification works</span>
      </div>
      <div className={styles.how}>
        {steps.map((s) => (
          <div key={s.step}>
            <div className={styles.howStep}>{s.step}</div>
            <div className={styles.howTitle}>{s.title}</div>
            <div className={styles.howCopy}>{s.copy}</div>
          </div>
        ))}
      </div>
    </>
  )
}
