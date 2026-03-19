import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import styles from '@/styles/Legal.module.css'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'Off The Grid privacy policy — how we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <div className={styles.wrap}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Legal</div>
          <h1 className={styles.headline}>
            Privacy<br />
            <em>policy.</em>
          </h1>
          <div className={styles.updated}>Last updated: March 2025</div>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>01 — What we collect</div>
            <p className={styles.p}>
              When you <strong>create an account</strong> on Off The Grid, we collect
              your email address and a hashed password. We do not collect your name,
              address, or any other identifying information at registration.
            </p>
            <p className={styles.p}>
              When you <strong>apply to sell</strong>, we collect the information you
              provide in the application form: your name, studio name, business type,
              location, Instagram handle (optional), email address, and annual customer
              volume. This information is used only for the purpose of reviewing your
              application.
            </p>
            <p className={styles.p}>
              When you <strong>make a purchase</strong>, we collect your name and
              email address to facilitate the transaction. Payment details are handled
              entirely by Stripe and are never stored on our servers.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>02 — How we use your information</div>
            <p className={styles.p}>
              We use your email address to authenticate your account and, if you are
              an approved designer, to contact you regarding your studio and listings.
            </p>
            <p className={styles.p}>
              Application data is used solely to evaluate eligibility to sell on the
              platform. We do not sell, rent, or share your application data with any
              third party.
            </p>
            <p className={styles.p}>
              Order data (name, email, listing ID) is shared with the relevant designer
              so they can fulfil your order. It is not shared with any other party.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>03 — Third-party services</div>
            <p className={styles.p}>
              <strong>Supabase</strong> — we use Supabase to host our database and
              authentication system. Your account credentials are stored in Supabase&apos;s
              infrastructure. See Supabase&apos;s privacy policy for details.
            </p>
            <p className={styles.p}>
              <strong>Stripe</strong> — all payments are processed by Stripe. When
              you check out, you are redirected to a Stripe-hosted page. We receive
              confirmation of payment status but not your card details.
              See Stripe&apos;s privacy policy for details.
            </p>
            <p className={styles.p}>
              <strong>Resend</strong> — we use Resend to send transactional emails
              (account confirmation, application status). Your email address is passed
              to Resend for this purpose only.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>04 — Cookies</div>
            <p className={styles.p}>
              Off The Grid uses a single authentication cookie to keep you signed in.
              This cookie contains a session token and is essential for the platform
              to function. We do not use advertising cookies, tracking pixels, or
              any third-party analytics.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>05 — Your rights</div>
            <p className={styles.p}>
              You may request deletion of your account and associated data at any time.
              If you are an approved designer, your public studio profile (name, studio
              number, bio, and listings) may be retained in an anonymised form for
              archival purposes unless you request full removal.
            </p>
            <p className={styles.p}>
              To request account deletion or a copy of your data, contact us through
              the application page.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>06 — Data retention</div>
            <p className={styles.p}>
              We retain account data for as long as your account is active. Application
              data is retained for up to two years after a decision is made, to support
              our verification process. Order records are retained for seven years for
              accounting purposes.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>07 — Contact</div>
            <p className={styles.p}>
              For privacy-related queries, contact us through the application page.
              We aim to respond within five working days.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
