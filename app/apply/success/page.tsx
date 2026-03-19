import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Application received',
  robots: { index: false },
}

export default function ApplySuccessPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '48px',
        textAlign: 'center',
        background: 'var(--bg)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-im-fell), serif',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 400,
          lineHeight: 1.1,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        We&apos;ll be in touch.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--faint)',
          textDecoration: 'none',
        }}
      >
        ← Back to Off The Grid
      </Link>
    </div>
  )
}
