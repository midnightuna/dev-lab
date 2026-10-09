import Link from 'next/link'
import type { ElementType, ReactNode } from 'react'
import { css } from 'styled-system/css'

import { siteConfig } from '@/config/site'
import { routes } from '@/lib/routes'

interface PageContainerProps {
  as?: ElementType
  children: ReactNode
}

const containerStyles = css({
  marginInline: 'auto',
  maxWidth: '5xl',
  paddingInline: { base: '5', sm: '6', md: '10' },
  width: 'full',
})

const siteHeaderStyles = css({
  backgroundColor: 'canvas',
  borderBottomColor: 'border',
  borderBottomWidth: '1px',
})

const headerContentStyles = css({
  alignItems: 'center',
  display: 'flex',
  gap: '6',
  justifyContent: 'space-between',
  minHeight: { base: '16', md: '20' },
})

const siteNameStyles = css({
  fontWeight: 'bold',
  letterSpacing: 'tight',
  _focusVisible: {
    outlineColor: 'accent',
    outlineOffset: '1',
    outlineStyle: 'solid',
    outlineWidth: '2px',
  },
})

const navLinkStyles = css({
  color: 'text.muted',
  fontWeight: 'medium',
  _focusVisible: {
    outlineColor: 'accent',
    outlineOffset: '1',
    outlineStyle: 'solid',
    outlineWidth: '2px',
  },
  _hover: { color: 'text' },
})

export function PageContainer({ as: Component = 'div', children }: PageContainerProps) {
  return <Component className={containerStyles}>{children}</Component>
}

export function SiteHeader() {
  return (
    <header className={siteHeaderStyles}>
      <PageContainer>
        <div className={headerContentStyles}>
          <Link className={siteNameStyles} href={routes.home}>
            {siteConfig.name}
          </Link>
          <nav aria-label="주요 메뉴">
            <Link className={navLinkStyles} href={routes.posts}>
              Posts
            </Link>
          </nav>
        </div>
      </PageContainer>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer
      className={css({
        borderTopColor: 'border',
        borderTopWidth: '1px',
        color: 'text.muted',
        paddingBlock: '8',
      })}
    >
      <PageContainer>
        <small>© {new Date().getUTCFullYear()} nightuna. Built as a static engineering log.</small>
      </PageContainer>
    </footer>
  )
}
