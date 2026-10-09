import { notFound } from 'next/navigation'
import { css } from 'styled-system/css'

import { MarkdownContent } from '@/components/markdown-content'
import { SeriesPostList } from '@/components/series-post-list'
import { PageContainer } from '@/components/site-shell'
import { TaxonomyList } from '@/components/taxonomy-list'
import {
  getPostBySlug,
  getPublishedPosts,
  getSeriesLabel,
  getSeriesPosts,
  getTagLabel,
} from '@/lib/blog-content'
import { formatPostDate } from '@/lib/date'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

const articleStyles = css({
  marginInline: 'auto',
  maxWidth: 'prose',
  paddingBlock: { base: '12', md: '20' },
})

const headerStyles = css({
  borderBottomColor: 'border',
  borderBottomWidth: '1px',
  display: 'grid',
  gap: '5',
  marginBlockEnd: { base: '10', md: '14' },
  paddingBlockEnd: { base: '8', md: '10' },
})

const titleStyles = css({
  fontSize: { base: '4xl', md: '6xl' },
  fontWeight: 'bold',
  letterSpacing: 'tighter',
  lineHeight: 'tight',
  overflowWrap: 'anywhere',
})

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (post === undefined) {
    notFound()
  }

  const seriesPosts = post.series === undefined ? [] : getSeriesPosts(post.series)

  return (
    <PageContainer as="main">
      <article className={articleStyles}>
        <header className={headerStyles}>
          <TaxonomyList
            tags={post.tags.map((tag) => getTagLabel(tag))}
            series={post.series === undefined ? undefined : getSeriesLabel(post.series)}
          />
          <h1 className={titleStyles}>{post.title}</h1>
          <p className={css({ color: 'text.muted' })}>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            {post.updatedAt === undefined ? null : (
              <>
                {' · 수정 '}
                <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
              </>
            )}
          </p>
        </header>

        <MarkdownContent source={post.body} />

        {post.series === undefined ? null : (
          <SeriesPostList
            currentSlug={post.slug}
            label={getSeriesLabel(post.series)}
            posts={seriesPosts}
          />
        )}
      </article>
    </PageContainer>
  )
}
