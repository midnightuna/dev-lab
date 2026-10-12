import type { MetadataRoute } from 'next'

import { getPublishedPosts } from '@/lib/blog-content'
import { getLatestPostDate, getPostUrl, toPublishedDateTime, toSiteUrl } from '@/lib/publishing'
import { routes } from '@/lib/routes'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()
  const latestPostDate = getLatestPostDate(posts)
  const staticRoutes = [routes.home, routes.posts].map((route) => ({
    url: toSiteUrl(route),
    ...(latestPostDate === undefined ? {} : { lastModified: toPublishedDateTime(latestPostDate) }),
  }))
  const postRoutes = posts.map((post) => ({
    url: getPostUrl(post),
    lastModified: toPublishedDateTime(post.updatedAt ?? post.date),
  }))

  return [...staticRoutes, ...postRoutes]
}
