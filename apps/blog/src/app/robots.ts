import type { MetadataRoute } from 'next'

import { toSiteUrl } from '@/lib/publishing'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: toSiteUrl('/sitemap.xml'),
  }
}
