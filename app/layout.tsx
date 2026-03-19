import type { Metadata } from 'next'
import { IM_Fell_English, DM_Mono, Syne } from 'next/font/google'
import './globals.css'

const imFellEnglish = IM_Fell_English({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-im-fell',
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
  title: 'Off The Grid — v5',
  description: 'A marketplace exclusively for independent fashion designers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${imFellEnglish.variable} ${dmMono.variable} ${syne.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
