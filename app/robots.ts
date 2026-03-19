import type { MetadataRoute } from 'next'
import { SITE_URL as BASE } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/auth', '/api'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
