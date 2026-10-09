import type { ReactNode } from 'react'
import { css, cva } from 'styled-system/css'

interface TaxonomyListProps {
  tags: readonly string[]
  series?: string
}

interface TaxonomyBadgeProps {
  children: ReactNode
  tone: 'tag' | 'series'
}

const listStyles = css({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  listStyle: 'none',
})

const badgeStyles = cva({
  base: {
    borderRadius: 'full',
    display: 'inline-flex',
    fontSize: 'sm',
    fontWeight: 'medium',
    lineHeight: 'tight',
    paddingBlock: '2',
    paddingInline: '3',
  },
  variants: {
    tone: {
      series: {
        backgroundColor: 'accent',
        color: 'surface',
      },
      tag: {
        backgroundColor: 'accent.subtle',
        color: 'accent',
      },
    },
  },
})

function TaxonomyBadge({ children, tone }: TaxonomyBadgeProps) {
  return <span className={badgeStyles({ tone })}>{children}</span>
}

export function TaxonomyList({ tags, series }: TaxonomyListProps) {
  return (
    <ul className={listStyles} aria-label="글 분류">
      {series === undefined ? null : (
        <li>
          <TaxonomyBadge tone="series">Series · {series}</TaxonomyBadge>
        </li>
      )}
      {tags.map((tag) => (
        <li key={tag}>
          <TaxonomyBadge tone="tag">{tag}</TaxonomyBadge>
        </li>
      ))}
    </ul>
  )
}
