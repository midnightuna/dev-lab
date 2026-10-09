import rehypeShiki from '@shikijs/rehype'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import { MarkdownAsync, type ExtraProps } from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { css } from 'styled-system/css'

import { withBasePath } from '@/config/site'

interface MarkdownContentProps {
  source: string
}

type MarkdownAnchorProps = ComponentPropsWithoutRef<'a'> & ExtraProps
type MarkdownImageProps = ComponentPropsWithoutRef<'img'> & ExtraProps
type MarkdownTableProps = ComponentPropsWithoutRef<'table'> & ExtraProps

const markdownStyles = css({
  color: 'text',
  overflowWrap: 'break-word',
  '& > :first-child': { marginBlockStart: '0' },
  '& > :last-child': { marginBlockEnd: '0' },
  '& h2': {
    fontSize: { base: '2xl', md: '3xl' },
    fontWeight: 'bold',
    letterSpacing: 'tight',
    marginBlockEnd: '4',
    marginBlockStart: { base: '10', md: '14' },
  },
  '& h3': {
    fontSize: { base: 'xl', md: '2xl' },
    fontWeight: 'bold',
    marginBlockEnd: '3',
    marginBlockStart: { base: '8', md: '10' },
  },
  '& h4': {
    fontSize: 'xl',
    fontWeight: 'bold',
    marginBlockEnd: '3',
    marginBlockStart: '8',
  },
  '& p': { marginBlock: '5' },
  '& a': {
    color: 'accent',
    fontWeight: 'medium',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    _focusVisible: {
      outlineColor: 'accent',
      outlineOffset: '[3px]',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    },
  },
  '& .heading-anchor': {
    marginInlineStart: '2',
    textDecoration: 'none',
  },
  '& ul, & ol': {
    display: 'grid',
    gap: '2',
    marginBlock: '5',
    paddingInlineStart: '6',
  },
  '& blockquote': {
    borderInlineStartColor: 'accent',
    borderInlineStartWidth: '4px',
    color: 'text.muted',
    marginBlock: '6',
    paddingInlineStart: '5',
  },
  '& :not(pre) > code': {
    backgroundColor: 'accent.subtle',
    borderRadius: 'sm',
    color: 'text',
    fontFamily: 'mono',
    fontSize: 'sm',
    paddingInline: '1.5',
  },
  '& pre': {
    borderRadius: 'xl',
    fontFamily: 'mono',
    fontSize: 'sm',
    lineHeight: 'relaxed',
    marginBlock: '6',
    maxWidth: 'full',
    overflowX: 'auto',
    padding: { base: '4', md: '5' },
  },
  '& pre code': { fontFamily: 'inherit' },
  '& .table-scroll': {
    maxWidth: 'full',
    overflowX: 'auto',
  },
  '& table': {
    borderCollapse: 'collapse',
    fontSize: 'sm',
    marginBlock: '6',
    minWidth: '[36rem]',
    width: 'full',
  },
  '& th, & td': {
    borderColor: 'border',
    borderWidth: '1px',
    padding: '3',
    textAlign: 'start',
    verticalAlign: 'top',
  },
  '& th': { backgroundColor: 'accent.subtle', fontWeight: 'bold' },
  '& img': {
    borderRadius: 'xl',
    height: 'auto',
    marginBlock: '6',
    maxWidth: 'full',
  },
  '& hr': { borderColor: 'border', marginBlock: '10' },
})

function isExternalHref(href: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(href)
}

function MarkdownLink({ node, href, children, className, title }: MarkdownAnchorProps) {
  void node

  if (href === undefined) {
    return <>{children}</>
  }

  if (href.startsWith('/')) {
    return (
      <Link className={className} href={href} title={title}>
        {children}
      </Link>
    )
  }

  if (href.startsWith('#') || isExternalHref(href)) {
    return (
      <a className={className} href={href} title={title}>
        {children}
      </a>
    )
  }

  throw new Error(
    `Markdown links must use a root-relative path, fragment, or absolute URL. Received: ${JSON.stringify(href)}`,
  )
}

function MarkdownImage({ node, src, alt, title, className }: MarkdownImageProps) {
  void node

  if (typeof src !== 'string' || !src.startsWith('/')) {
    throw new Error(
      `Markdown image sources must use a root-relative public path. Received: ${JSON.stringify(src)}`,
    )
  }

  return (
    <img
      alt={alt ?? ''}
      className={className}
      decoding="async"
      loading="lazy"
      src={withBasePath(src)}
      title={title}
    />
  )
}

function TableContainer({ node, children, className }: MarkdownTableProps) {
  void node

  return (
    <div className="table-scroll">
      <table className={className}>{children}</table>
    </div>
  )
}

export async function MarkdownContent({ source }: MarkdownContentProps) {
  return (
    <div className={markdownStyles}>
      <MarkdownAsync
        components={{ a: MarkdownLink, img: MarkdownImage, table: TableContainer }}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              content: { type: 'text', value: '#' },
              properties: {
                ariaLabel: '이 섹션으로 이동',
                className: ['heading-anchor'],
              },
            },
          ],
          [rehypeShiki, { fallbackLanguage: 'text', theme: 'github-light' }],
        ]}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {source}
      </MarkdownAsync>
    </div>
  )
}
