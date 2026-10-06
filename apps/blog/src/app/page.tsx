import { css } from 'styled-system/css'

import { siteConfig } from '@/config/site'

const mainStyles = css({
  alignItems: 'center',
  backgroundColor: 'canvas',
  display: 'flex',
  minHeight: '[100dvh]',
  paddingBlock: { base: '16', md: '24' },
  paddingInline: { base: '6', md: '10' },
})

const contentStyles = css({
  display: 'grid',
  gap: '10',
  marginInline: 'auto',
  maxWidth: '4xl',
  width: 'full',
})

const headerStyles = css({
  display: 'grid',
  gap: '5',
  maxWidth: '3xl',
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
  maxWidth: '2xl',
})

const cardStyles = css({
  backgroundColor: 'surface',
  borderColor: 'border',
  borderRadius: '2xl',
  borderWidth: '1px',
  display: 'grid',
  gap: '3',
  padding: { base: '6', md: '8' },
})

const cardTitleStyles = css({
  fontSize: 'xl',
  fontWeight: 'bold',
})

const cardBodyStyles = css({
  color: 'text.muted',
  maxWidth: '2xl',
})

export default function HomePage() {
  return (
    <main className={mainStyles}>
      <div className={contentStyles}>
        <header className={headerStyles}>
          <p className={eyebrowStyles}>Frontend engineering notes</p>
          <h1 className={titleStyles}>{siteConfig.name}</h1>
          <p className={taglineStyles}>{siteConfig.tagline}</p>
        </header>

        <section className={cardStyles} aria-labelledby="building-title">
          <h2 id="building-title" className={cardTitleStyles}>
            첫 번째 기록을 준비하고 있습니다.
          </h2>
          <p className={cardBodyStyles}>{siteConfig.description}</p>
        </section>
      </div>
    </main>
  )
}
