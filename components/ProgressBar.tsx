'use client'

import NextTopLoader from 'nextjs-toploader'

export default function ProgressBar() {
  return (
    <NextTopLoader
      color="#0d0d0b"
      height={1}
      showSpinner={false}
      crawlSpeed={200}
      speed={400}
      shadow={false}
    />
  )
}
