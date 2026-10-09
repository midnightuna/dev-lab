import type { Post } from '@dev-lab/content'
import Link from 'next/link'
import { css } from 'styled-system/css'

import { TaxonomyList } from '@/components/taxonomy-list'
import { getSeriesLabel, getTagLabel } from '@/lib/blog-content'
import { formatPostDate } from '@/lib/date'
import { getPostRoute } from '@/lib/routes'

interface PostListProps {
  posts: readonly Post[]
  headingLevel?: 2 | 3
  emptyTitle: string
  emptyDescription: string
}

const listStyles = css({
  display: 'grid',
  gap: '5',
  gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
  listStyle: 'none',
})

const cardStyles = css({
  backgroundColor: 'surface',
  borderColor: 'border',
  borderRadius: '2xl',
  borderWidth: '1px',
  display: 'grid',
  gap: '4',
  height: 'full',
  padding: { base: '6', md: '8' },
  transitionDuration: 'normal',
  transitionProperty: 'border-color, transform',
  _hover: {
    borderColor: 'accent',
    transform: 'translateY(-2px)',
  },
})

const titleLinkStyles = css({
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  overflowWrap: 'anywhere',
  _focusVisible: {
    outlineColor: 'accent',
    outlineOffset: '1',
    outlineStyle: 'solid',
    outlineWidth: '2px',
  },
  _hover: { color: 'accent' },
})

const emptyStyles = css({
  backgroundColor: 'surface',
  borderColor: 'border',
  borderRadius: '2xl',
  borderStyle: 'dashed',
  borderWidth: '1px',
  display: 'grid',
  gap: '2',
  padding: { base: '8', md: '12' },
})

export function PostList({ posts, headingLevel = 2, emptyTitle, emptyDescription }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className={emptyStyles} role="status">
        <p className={css({ fontSize: 'xl', fontWeight: 'bold' })}>{emptyTitle}</p>
        <p className={css({ color: 'text.muted' })}>{emptyDescription}</p>
      </div>
    )
  }

  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <ol className={listStyles}>
      {posts.map((post) => (
        <li key={post.slug}>
          <article className={cardStyles}>
            <TaxonomyList
              tags={post.tags.map((tag) => getTagLabel(tag))}
              series={post.series === undefined ? undefined : getSeriesLabel(post.series)}
            />
            <Heading>
              <Link className={titleLinkStyles} href={getPostRoute(post.slug)}>
                {post.title}
              </Link>
            </Heading>
            <p className={css({ color: 'text.muted' })}>{post.excerpt}</p>
            <time className={css({ color: 'text.muted', fontSize: 'sm' })} dateTime={post.date}>
              {formatPostDate(post.date)}
            </time>
          </article>
        </li>
      ))}
    </ol>
  )
}
