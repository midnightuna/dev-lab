import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { css } from 'styled-system/css'

import { MarkdownContent } from '@/components/markdown-content'
import { SeriesPostList } from '@/components/series-post-list'
import { PageContainer } from '@/components/site-shell'
import { TaxonomyList } from '@/components/taxonomy-list'
import { siteConfig } from '@/config/site'
import {
  getPostBySlug,
  getPublishedPosts,
  getSeriesLabel,
  getSeriesPosts,
  getTagLabel,
} from '@/lib/blog-content'
import { formatPostDate } from '@/lib/date'
import {
  getMetadataAlternates,
  getPostImageUrl,
  getPostUrl,
  toPublishedDateTime,
} from '@/lib/publishing'
import { getPostRoute } from '@/lib/routes'

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

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (post === undefined) {
    notFound()
  }

  const canonicalUrl = getPostUrl(post)
  const imageUrl = getPostImageUrl(post)
  const publishedTime = toPublishedDateTime(post.date)
  const modifiedTime = toPublishedDateTime(post.updatedAt ?? post.date)

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: siteConfig.author }],
    keywords: post.tags.map((tag) => getTagLabel(tag)),
    alternates: getMetadataAlternates(getPostRoute(post.slug)),
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: post.title,
      description: post.excerpt,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime,
      modifiedTime,
      authors: [siteConfig.author],
      tags: post.tags.map((tag) => getTagLabel(tag)),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (post === undefined) {
    notFound()
  }

  const seriesPosts = post.series === undefined ? [] : getSeriesPosts(post.series)
  const canonicalUrl = getPostUrl(post)
  const imageUrl = getPostImageUrl(post)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: toPublishedDateTime(post.date),
    dateModified: toPublishedDateTime(post.updatedAt ?? post.date),
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    image: imageUrl,
    keywords: post.tags.map((tag) => getTagLabel(tag)),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    inLanguage: siteConfig.language,
  }

  return (
    <PageContainer as="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
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
