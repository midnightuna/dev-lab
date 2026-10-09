import Link from 'next/link'
import { css } from 'styled-system/css'

import { PageContainer } from '@/components/site-shell'
import { routes } from '@/lib/routes'

const contentStyles = css({
  alignContent: 'center',
  display: 'grid',
  gap: '5',
  minHeight: '[65dvh]',
  paddingBlock: '16',
})

const titleStyles = css({
  fontSize: { base: '3xl', md: '5xl' },
  fontWeight: 'bold',
  letterSpacing: 'tight',
})

const linkStyles = css({
  color: 'accent',
  fontWeight: 'bold',
  width: 'fit',
  _focusVisible: {
    outlineColor: 'accent',
    outlineOffset: '1',
    outlineStyle: 'solid',
    outlineWidth: '2px',
  },
  _hover: { textDecoration: 'underline' },
})

export default function NotFoundPage() {
  return (
    <PageContainer as="main">
      <div className={contentStyles}>
        <p className={css({ color: 'accent', fontWeight: 'bold' })}>404</p>
        <h1 className={titleStyles}>페이지를 찾을 수 없습니다.</h1>
        <p className={css({ color: 'text.muted', maxWidth: 'xl' })}>
          주소가 변경되었거나 공개되지 않은 글일 수 있습니다.
        </p>
        <Link className={linkStyles} href={routes.home}>
          홈으로 돌아가기
        </Link>
      </div>
    </PageContainer>
  )
}
