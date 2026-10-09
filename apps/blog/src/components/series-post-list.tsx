import type { Post } from '@dev-lab/content'
import Link from 'next/link'
import { css } from 'styled-system/css'

import { formatPostDate } from '@/lib/date'
import { getPostRoute } from '@/lib/routes'

interface SeriesPostListProps {
  currentSlug: string
  label: string
  posts: readonly Post[]
}

const sectionStyles = css({
  borderTopColor: 'border',
  borderTopWidth: '1px',
  display: 'grid',
  gap: '5',
  marginBlockStart: { base: '12', md: '16' },
  paddingBlockStart: { base: '8', md: '10' },
})

const listStyles = css({
  display: 'grid',
  gap: '3',
  listStylePosition: 'inside',
})

export function SeriesPostList({ currentSlug, label, posts }: SeriesPostListProps) {
  return (
    <aside className={sectionStyles} aria-labelledby="series-posts-title">
      <div>
        <p className={css({ color: 'accent', fontSize: 'sm', fontWeight: 'bold' })}>SERIES</p>
        <h2 id="series-posts-title" className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
          {label}
        </h2>
      </div>
      <ol className={listStyles}>
        {posts.map((post) => {
          const isCurrent = post.slug === currentSlug

          return (
            <li key={post.slug} aria-current={isCurrent ? 'page' : undefined}>
              {isCurrent ? (
                <strong>{post.title}</strong>
              ) : (
                <Link
                  className={css({ color: 'accent', _hover: { textDecoration: 'underline' } })}
                  href={getPostRoute(post.slug)}
                >
                  {post.title}
                </Link>
              )}{' '}
              <time className={css({ color: 'text.muted', fontSize: 'sm' })} dateTime={post.date}>
                {formatPostDate(post.date)}
              </time>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
