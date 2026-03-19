'use client'

import { useActionState } from 'react'
import { signIn, type AuthFormState } from '@/app/auth/actions'
import styles from '@/styles/Auth.module.css'

export default function SignInForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signIn,
    {}
  )

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
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      {state.error && (
        <div className={styles.error}>{state.error}</div>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
