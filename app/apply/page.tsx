import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ApplyForm from '@/components/ApplyForm'
import styles from '@/styles/Apply.module.css'

export const metadata: Metadata = {
  title: 'Apply to sell',
  description:
    'Apply to sell on Off The Grid. For independent fashion designers under the customer threshold. Manual review. 5–7 days. Every application read by a person.',
  openGraph: {
    title: 'Apply to sell — Off The Grid',
    description:
      'Independent designers working alone or in small studios. Under the threshold. Apply now.',
    images: [{ url: '/hero-bg.jpg' }],
  },
}

export default function ApplyPage() {
  return (
    <>
      <Nav />

      <div className={styles.header}>
        <div className={styles.eyebrow}>Application — Off The Grid</div>
        <h1 className={styles.headline}>
          Apply to sell.<br />
          <em>If you qualify.</em>
        </h1>
        <p className={styles.headerSub}>
          OTG is invitation-only by threshold. Independent designers under the
          customer limit, working alone or in small studios. Every application
          is reviewed by hand.
        </p>
      </div>

      <div className={styles.criteria}>
        <div>
          <div className={styles.criterionN}>01</div>
          <div className={styles.criterionText}>
            Your business must be <strong>independently registered.</strong> No
            limited companies above a single-person threshold.
          </div>
        </div>
        <div>
          <div className={styles.criterionN}>02</div>
          <div className={styles.criterionText}>
            Customer volume below <strong>500 orders per year.</strong> This
            isn&apos;t a boutique brand platform — it&apos;s for the bedroom and
            small studio tier.
          </div>
        </div>
        <div>
          <div className={styles.criterionN}>03</div>
          <div className={styles.criterionText}>
            You must <strong>make what you sell.</strong> Resellers, agents, and
            fulfillment-only studios are not eligible.
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formIntro}>
          <div className={styles.formIntroLabel}>The application</div>
          <h2 className={styles.formIntroHed}>
            Short form.<br />
            <em>Manual review.</em><br />
            5–7 days.
          </h2>
          <p className={styles.formIntroCopy}>
            We don&apos;t use automated scoring. Every application is read by a
            person. We&apos;ll ask follow-up questions if we need more. If
            approved, you receive a permanent studio number.
          </p>
        </div>

        <ApplyForm />
      </div>

      <Footer />
    </>
  )
}
