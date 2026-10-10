import type { Post } from '@dev-lab/content'

import { siteConfig } from '@/config/site'
import { getPostRoute } from '@/lib/routes'

export const defaultOpenGraphImagePath = '/images/og/default.png'
export const rssRoute = '/rss.xml'

export function toSiteUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`Site routes must start with "/". Received: ${JSON.stringify(path)}`)
  }

  const siteRoot = `${siteConfig.siteUrl}/`

  return new URL(path.slice(1), siteRoot).toString()
}

export function getMetadataAlternates(path: string) {
  return {
    canonical: toSiteUrl(path),
    types: {
      'application/rss+xml': toSiteUrl(rssRoute),
    },
  }
}

export function getPostImagePath(post: Post): string {
  return post.thumbnail ?? defaultOpenGraphImagePath
}

export function getPostUrl(post: Post): string {
  return toSiteUrl(getPostRoute(post.slug))
}

export function getPostImageUrl(post: Post): string {
  return toSiteUrl(getPostImagePath(post))
}

export function toPublishedDateTime(date: string): string {
  return `${date}T00:00:00+09:00`
}

export function getLatestPostDate(posts: readonly Post[]): string | undefined {
  return posts.reduce<string | undefined>((latestDate, post) => {
    const postDate = post.updatedAt ?? post.date

    return latestDate === undefined || postDate > latestDate ? postDate : latestDate
  }, undefined)
}
