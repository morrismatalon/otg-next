import type { Metadata } from 'next'
import { Space_Grotesk, DM_Mono, Syne } from 'next/font/google'
import ProgressBar from '@/components/ProgressBar'
import AuthProvider from '@/components/AuthProvider'
import { SITE_URL } from '@/lib/config'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const syne = Syne({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Off The Grid — Independent fashion designers',
    template: '%s — Off The Grid',
  },
  description:
    'A marketplace exclusively for independent fashion designers. Bedroom studios and small offices. Every designer manually verified.',
  keywords: ['independent fashion', 'fashion designers', 'small studios', 'handmade clothing', 'independent designers'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Off The Grid',
    title: 'Off The Grid — Independent fashion designers',
    description:
      'No brands. No resellers. Only verified independent designers working alone or in small studios.',
    images: [{ url: '/hero-bg.jpg', width: 1200, height: 630, alt: 'Off The Grid' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off The Grid',
    description: 'A marketplace for independent fashion designers. No brands. Only people.',
    images: ['/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmMono.variable} ${syne.variable}`}
    >
      <body>
        <ProgressBar />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
