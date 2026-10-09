import type { Post } from './domain.ts'

export const isPostVisible = (post: Post): boolean => post.status === 'published'
