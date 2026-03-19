'use client'

import { signOut } from '@/app/auth/actions'
import styles from '@/styles/Dashboard.module.css'

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className={styles.signOutBtn}>
        Sign out →
      </button>
    </form>
  )
}
