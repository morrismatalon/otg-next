'use client'

import { useActionState } from 'react'
import { signUp, type AuthFormState } from '@/app/auth/actions'
import styles from '@/styles/Auth.module.css'

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signUp,
    {}
  )

  if (state.success) {
    return (
      <p className={styles.success}>
        Check your email to confirm your account. Once confirmed you can sign in.
      </p>
    )
  }

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.input}
          placeholder="you@studio.com"
          required
          autoComplete="email"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          placeholder="Min. 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      {state.error && (
        <div className={styles.error}>{state.error}</div>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
