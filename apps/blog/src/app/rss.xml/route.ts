import { siteConfig } from '@/config/site'
import { getPublishedPosts } from '@/lib/blog-content'
import {
  getLatestPostDate,
  getPostUrl,
  rssRoute,
  toPublishedDateTime,
  toSiteUrl,
} from '@/lib/publishing'
import { routes } from '@/lib/routes'

export const dynamic = 'force-static'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toRssDate(date: string): string {
  return new Date(toPublishedDateTime(date)).toUTCString()
}

export function GET(): Response {
  const posts = getPublishedPosts()
  const latestPostDate = getLatestPostDate(posts)
  const items = posts
    .map((post) => {
      const postUrl = getPostUrl(post)

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${toRssDate(post.date)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    })
    .join('\n')
  const lastBuildDate =
    latestPostDate === undefined
      ? ''
      : `\n    <lastBuildDate>${toRssDate(latestPostDate)}</lastBuildDate>`

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(toSiteUrl(routes.home))}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ko-KR</language>
    <atom:link href="${escapeXml(toSiteUrl(rssRoute))}" rel="self" type="application/rss+xml" />${lastBuildDate}
${items}
  </channel>
</rss>
`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
