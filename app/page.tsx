import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Statement from '@/components/Statement'
import Feed from '@/components/Feed'
import CreatorProfile from '@/components/CreatorProfile'
import ApplyBand from '@/components/ApplyBand'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'The independent fashion marketplace',
  description:
    'Off The Grid is a marketplace exclusively for independent fashion designers — bedroom studios and small offices. Verified. Not for everyone.',
  openGraph: {
    title: 'Off The Grid — The independent fashion marketplace',
    description:
      'No brands. No resellers. Only verified independent designers working alone or in small studios.',
    images: [{ url: '/hero-bg.jpg', width: 1200, height: 630 }],
  },
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Statement />
      <Feed />
      <CreatorProfile />
      <ApplyBand />
      <HowItWorks />
      <Footer />
    </>
  )
}
