import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavSearch from '@/components/NavSearch'
import styles from '@/styles/Nav.module.css'

function emailInitials(email: string): string {
  const local = email.split('@')[0]
  const parts = local.split(/[._\-+]/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return local.slice(0, 2).toUpperCase()
}

export default async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <nav className={styles.navTop}>
        <Link href="/" className={styles.navLogo}>
          <Image
            src="/logo.png"
            alt="Off The Grid"
            width={120}
            height={26}
            style={{ mixBlendMode: 'multiply', height: 26, width: 'auto' }}
          />
        </Link>

        <NavSearch />

        <div className={styles.navTopRight}>
          {user ? (
            <Link
              href="/account"
              className={styles.navAvatar}
              title={user.email ?? 'Account'}
            >
              {emailInitials(user.email ?? 'ME')}
            </Link>
          ) : (
            <Link href="/auth/sign-in">Sign in</Link>
          )}
          <Link href="/apply" className={styles.cta}>Apply to sell</Link>
        </div>
      </nav>

      <div className={styles.navCats}>
        <Link href="/browse?category=Outerwear">Outerwear</Link>
        <Link href="/browse?category=Tops">Tops</Link>
        <Link href="/browse?category=Bottoms">Bottoms</Link>
        <Link href="/browse?category=Accessories">Accessories</Link>
        <Link href="/designers">Designers</Link>
        <Link href="/browse">All listings</Link>
      </div>
    </>
  )
}
