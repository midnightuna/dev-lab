import type { Metadata } from 'next'
import { css } from 'styled-system/css'

import { PostList } from '@/components/post-list'
import { PageContainer } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { getPublishedPosts } from '@/lib/blog-content'
import { defaultOpenGraphImagePath, getMetadataAlternates, toSiteUrl } from '@/lib/publishing'
import { routes } from '@/lib/routes'

const title = 'Posts'
const description = 'nightuna dev log에 발행된 기술 기록을 최신순으로 모았습니다.'
const canonicalUrl = toSiteUrl(routes.posts)
const openGraphImageUrl = toSiteUrl(defaultOpenGraphImagePath)

export const metadata: Metadata = {
  title,
  description,
  alternates: getMetadataAlternates(routes.posts),
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    title,
    description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: openGraphImageUrl, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [openGraphImageUrl],
  },
}

const headerStyles = css({
  display: 'grid',
  gap: '4',
  maxWidth: '3xl',
  paddingBlock: { base: '12', md: '16' },
})

const titleStyles = css({
  fontSize: { base: '4xl', md: '6xl' },
  fontWeight: 'bold',
  letterSpacing: 'tighter',
  lineHeight: 'tight',
})

export default function PostsPage() {
  const posts = getPublishedPosts()

  return (
    <PageContainer as="main">
      <header className={headerStyles}>
        <p className={css({ color: 'accent', fontSize: 'sm', fontWeight: 'bold' })}>POSTS</p>
        <h1 className={titleStyles}>모든 글</h1>
        <p className={css({ color: 'text.muted', fontSize: 'lg' })}>
          최근에 발행한 글부터 차례로 모았습니다.
        </p>
      </header>
      <div className={css({ paddingBlockEnd: { base: '16', md: '24' } })}>
        <PostList
          posts={posts}
          emptyTitle="아직 공개된 글이 없습니다."
          emptyDescription="첫 글이 발행되면 이곳에서 확인할 수 있습니다."
        />
      </div>
    </PageContainer>
  )
}
