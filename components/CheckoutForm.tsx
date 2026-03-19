'use client'

import { useActionState } from 'react'
import { placeOrder, type CheckoutState } from '@/app/checkout/[id]/actions'
import styles from '@/styles/Checkout.module.css'

const initialState: CheckoutState = {}

export default function CheckoutForm({ listingId }: { listingId: string }) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState)

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="listingId" value={listingId} />

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="buyerName">Your name *</label>
        <input
          id="buyerName"
          name="buyerName"
          className={styles.input}
          type="text"
          placeholder="Full name"
          required
          autoComplete="name"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="buyerEmail">Email address *</label>
        <input
          id="buyerEmail"
          name="buyerEmail"
          className={styles.input}
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="message">Message to designer</label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Size, colour preferences, shipping notes, questions…"
          rows={4}
        />
      </div>

      {state.error && (
        <div className={styles.formError}>{state.error}</div>
      )}

      <div>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Redirecting to payment…' : 'Pay with Stripe →'}
        </button>
        <div className={styles.note}>
          You&apos;ll be taken to Stripe&apos;s secure checkout to complete payment.
          The designer will then confirm and arrange shipping.
        </div>
      </div>
    </form>
  )
}
