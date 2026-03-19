import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from '@/styles/Legal.module.css'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'Off The Grid terms of use — the rules that govern how the platform works.',
}

export default function TermsPage() {
  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Legal</div>
          <h1 className={styles.headline}>
            Terms<br />
            <em>of use.</em>
          </h1>
          <div className={styles.updated}>Last updated: March 2025</div>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>01 — What Off The Grid is</div>
            <p className={styles.p}>
              Off The Grid is a marketplace platform for <strong>independent fashion
              designers</strong> — sole traders, self-employed individuals, and very
              small studios operating below a defined customer volume threshold.
              We are not a brand platform. We are not a reseller platform. We exist
              specifically for the tier of maker who works alone or nearly alone.
            </p>
            <p className={styles.p}>
              By using Off The Grid as a buyer or seller, you agree to these terms.
              If you do not agree, please do not use the platform.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>02 — Eligibility to sell</div>
            <p className={styles.p}>
              To sell on Off The Grid, you must meet the following criteria at the time
              of application and on an ongoing basis:
            </p>
            <p className={styles.p}>
              You must operate as a <strong>sole trader, self-employed individual,
              or micro partnership</strong> of no more than three people. Your business
              must be independently registered or otherwise verifiable as a genuine
              independent operation.
            </p>
            <p className={styles.p}>
              Your annual customer volume must be <strong>below 500 orders per
              year</strong>. This threshold is checked at application and re-verified
              annually. Designers who grow beyond this threshold will be invited to
              transition off the platform gracefully.
            </p>
            <p className={styles.p}>
              You must <strong>make what you sell</strong>. Resellers, dropshippers,
              agents, and fulfillment-only operations are ineligible regardless of their
              business size.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>03 — Listings and transactions</div>
            <p className={styles.p}>
              All listings on Off The Grid represent items made by the listed designer.
              Sellers are responsible for the accuracy of their listings, including
              pricing, availability, and descriptions.
            </p>
            <p className={styles.p}>
              Transactions facilitated through Off The Grid are subject to the payment
              terms of our payment processor, Stripe. Off The Grid does not hold funds
              on behalf of buyers or sellers. Any disputes regarding payment or
              fulfilment are between the buyer and the designer directly.
            </p>
            <p className={styles.p}>
              Off The Grid takes no commission on sales. We charge no listing fees.
              The platform is currently free to use for verified designers.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>04 — Verification and removal</div>
            <p className={styles.p}>
              All designers on Off The Grid are <strong>manually verified</strong>
              by our team before their studio becomes active. Verification is not
              guaranteed and is at our sole discretion.
            </p>
            <p className={styles.p}>
              We reserve the right to remove any designer or listing from the platform
              at any time, without notice, if we determine that the terms of eligibility
              are no longer being met or if any content violates these terms.
            </p>
            <p className={styles.p}>
              Studio numbers are permanent and belong to the individual designer, not
              to a brand or business name. If a designer changes their trading name,
              their studio number remains unchanged.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>05 — Intellectual property</div>
            <p className={styles.p}>
              Designers retain full intellectual property rights over their designs,
              photographs, and written descriptions. By listing on Off The Grid, you
              grant us a non-exclusive, royalty-free licence to display your content
              on the platform for the purpose of facilitating sales.
            </p>
            <p className={styles.p}>
              The Off The Grid name, logo, and all platform code and design are our
              intellectual property. You may not reproduce or adapt them without
              written permission.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>06 — Limitation of liability</div>
            <p className={styles.p}>
              Off The Grid is provided &ldquo;as is&rdquo; without warranties of any kind.
              We are not liable for any loss or damage arising from use of the platform,
              including but not limited to disputes between buyers and sellers,
              payment failures, or interruptions to service.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>07 — Changes to these terms</div>
            <p className={styles.p}>
              We may update these terms from time to time. Where changes are material,
              we will notify designers via the email address registered to their account.
              Continued use of the platform following notice of changes constitutes
              acceptance of the updated terms.
            </p>
            <p className={styles.p}>
              Questions? Contact us through the application page.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
