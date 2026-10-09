export const routes = {
  home: '/',
  posts: '/posts/',
} as const

export function getPostRoute(slug: string): string {
  return `${routes.posts}${encodeURIComponent(slug)}/`
}
