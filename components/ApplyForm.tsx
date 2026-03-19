'use client'

import { useActionState } from 'react'
import { submitApplication, type ApplyFormState } from '@/app/apply/actions'
import styles from '@/styles/Apply.module.css'

const initialState: ApplyFormState = {}

export default function ApplyForm() {
  const [state, formAction, pending] = useActionState(submitApplication, initialState)

  if (state.success) {
    return (
      <div style={{ paddingTop: 8 }}>
        <div className={styles.formIntroLabel} style={{ marginBottom: 20 }}>
          Application received
        </div>
        <p className={styles.formIntroCopy}>
          We&apos;ll review your application and follow up within 5–7 days.
          Thank you for applying.
        </p>
      </div>
    )
  }

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="name">Your name</label>
        <input
          id="name"
          name="name"
          className={styles.input}
          type="text"
          placeholder="Full name"
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="studio">Studio name</label>
        <input
          id="studio"
          name="studio"
          className={styles.input}
          type="text"
          placeholder="What do you trade under?"
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="type">Business type</label>
        <select id="type" name="type" className={styles.select} required defaultValue="">
          <option value="" disabled>Select type</option>
          <option value="sole-trader">Sole trader</option>
          <option value="self-employed">Self-employed individual</option>
          <option value="small-partnership">Small partnership (2–3 people)</option>
          <option value="micro-ltd">Micro limited company (&lt;5 employees)</option>
          <option value="unregistered">Unregistered / informal</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          className={styles.input}
          type="text"
          placeholder="City, Country"
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="instagram">Instagram handle</label>
        <input
          id="instagram"
          name="instagram"
          className={styles.input}
          type="text"
          placeholder="@yourstudio"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="volume">Annual customer volume</label>
        <select id="volume" name="volume" className={styles.select} required defaultValue="">
          <option value="" disabled>Select range</option>
          <option value="under-50">Under 50 orders / year</option>
          <option value="50-150">50–150 orders / year</option>
          <option value="150-300">150–300 orders / year</option>
          <option value="300-500">300–500 orders / year</option>
          <option value="over-500">Over 500 — likely ineligible</option>
        </select>
      </div>

      {state.error && (
        <div className={styles.note} style={{ color: 'var(--ink)' }}>
          {state.error}
        </div>
      )}

      <div>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? 'Submitting…' : 'Submit application'}
        </button>
        <div className={styles.note}>
          No account needed. We&apos;ll contact you by email.
        </div>
      </div>
    </form>
  )
}
