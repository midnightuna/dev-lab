import Link from 'next/link'
import { css } from 'styled-system/css'

import { PostList } from '@/components/post-list'
import { PageContainer } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { getPublishedPosts } from '@/lib/blog-content'
import { routes } from '@/lib/routes'

const heroStyles = css({
  display: 'grid',
  gap: '5',
  maxWidth: '4xl',
  paddingBlock: { base: '12', md: '20' },
})

const eyebrowStyles = css({
  color: 'accent',
  fontSize: 'sm',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
})

const titleStyles = css({
  fontSize: 'display',
  fontWeight: 'bold',
  letterSpacing: 'tighter',
  lineHeight: 'tight',
})

const taglineStyles = css({
  color: 'text.muted',
  fontSize: { base: 'xl', md: '2xl' },
  maxWidth: '3xl',
})

const sectionStyles = css({
  display: 'grid',
  gap: '6',
  paddingBlockEnd: { base: '16', md: '24' },
})

const sectionHeaderStyles = css({
  alignItems: { base: 'start', md: 'end' },
  display: 'flex',
  flexDirection: { base: 'column', md: 'row' },
  gap: '4',
  justifyContent: 'space-between',
})

const sectionTitleStyles = css({
  fontSize: { base: '2xl', md: '3xl' },
  fontWeight: 'bold',
  letterSpacing: 'tight',
})

const allPostsLinkStyles = css({
  color: 'accent',
  fontWeight: 'bold',
  textDecoration: 'underline',
  textDecorationColor: 'border',
  textUnderlineOffset: '4px',
  _focusVisible: {
    outlineColor: 'accent',
    outlineOffset: '1',
    outlineStyle: 'solid',
    outlineWidth: '2px',
  },
  _hover: { textDecorationColor: 'accent' },
})

export default function HomePage() {
  const latestPosts = getPublishedPosts().slice(0, 3)

  return (
    <PageContainer as="main">
      <header className={heroStyles}>
        <p className={eyebrowStyles}>Frontend engineering notes</p>
        <h1 className={titleStyles}>{siteConfig.name}</h1>
        <p className={taglineStyles}>{siteConfig.tagline}</p>
        <p className={css({ color: 'text.muted', maxWidth: '2xl' })}>{siteConfig.description}</p>
      </header>

      <section className={sectionStyles} aria-labelledby="latest-posts-title">
        <div className={sectionHeaderStyles}>
          <h2 id="latest-posts-title" className={sectionTitleStyles}>
            최신 글
          </h2>
          <Link className={allPostsLinkStyles} href={routes.posts}>
            모든 글 보기
          </Link>
        </div>
        <PostList
          posts={latestPosts}
          headingLevel={3}
          emptyTitle="아직 공개된 글이 없습니다."
          emptyDescription="첫 번째 기술 기록을 준비하고 있습니다."
        />
      </section>
    </PageContainer>
  )
}
