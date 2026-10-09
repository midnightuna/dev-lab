import { css } from 'styled-system/css'

import { PostList } from '@/components/post-list'
import { PageContainer } from '@/components/site-shell'
import { getPublishedPosts } from '@/lib/blog-content'

const headerStyles = css({
  display: 'grid',
  gap: '4',
  maxWidth: '3xl',
  paddingBlock: { base: '12', md: '16' },
})

const titleStyles = css({
  fontSize: { base: '4xl', md: '6xl' },
  fontWeight: 'bold',
  letterSpacing: 'tighter',
  lineHeight: 'tight',
})

export default function PostsPage() {
  const posts = getPublishedPosts()

  return (
    <PageContainer as="main">
      <header className={headerStyles}>
        <p className={css({ color: 'accent', fontSize: 'sm', fontWeight: 'bold' })}>POSTS</p>
        <h1 className={titleStyles}>모든 글</h1>
        <p className={css({ color: 'text.muted', fontSize: 'lg' })}>
          최근에 발행한 글부터 차례로 모았습니다.
        </p>
      </header>
      <div className={css({ paddingBlockEnd: { base: '16', md: '24' } })}>
        <PostList
          posts={posts}
          emptyTitle="아직 공개된 글이 없습니다."
          emptyDescription="첫 글이 발행되면 이곳에서 확인할 수 있습니다."
        />
      </div>
    </PageContainer>
  )
}
