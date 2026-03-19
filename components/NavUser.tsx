'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import styles from '@/styles/Nav.module.css'

function emailInitials(email: string): string {
  const local = email.split('@')[0]
  const parts = local.split(/[._\-+]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

export default function NavUser() {
  const { user } = useAuth()

  if (user) {
    return (
      <Link
        href="/account"
        className={styles.navAvatar}
        title={user.email ?? 'Account'}
      >
        {emailInitials(user.email ?? 'ME')}
      </Link>
    )
  }

  return <Link href="/auth/sign-in">Sign in</Link>
}
