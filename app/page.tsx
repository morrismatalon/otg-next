import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Statement from '@/components/Statement'
import Feed from '@/components/Feed'
import CreatorProfile from '@/components/CreatorProfile'
import ApplyBand from '@/components/ApplyBand'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

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
