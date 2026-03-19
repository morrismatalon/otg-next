import type { MetadataRoute } from 'next'
import { createBuildClient } from '@/lib/supabase/build'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://offthegrid.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/designers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/apply`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const client = createBuildClient()
    const [{ data: designers }, { data: listings }] = await Promise.all([
      client.from('designers').select('id'),
      client.from('listings').select('id'),
    ])

    const designerRoutes: MetadataRoute.Sitemap = (designers ?? []).map((d) => ({
      url: `${BASE}/studio/${d.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const listingRoutes: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
      url: `${BASE}/listings/${l.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...designerRoutes, ...listingRoutes]
  } catch {
    return staticRoutes
  }
}
