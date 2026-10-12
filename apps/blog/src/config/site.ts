const DEFAULT_SITE_URL = 'http://localhost:3000'
const DEFAULT_BASE_PATH = ''

export interface SiteConfig {
  name: string
  author: string
  tagline: string
  description: string
  language: string
  locale: string
  siteUrl: string
  basePath: string
}

function normalizeBasePath(value: string): string {
  const trimmedValue = value.trim()

  if (trimmedValue === '' || trimmedValue === '/') {
    return ''
  }

  const normalizedValue = trimmedValue.endsWith('/') ? trimmedValue.slice(0, -1) : trimmedValue

  if (!normalizedValue.startsWith('/') || normalizedValue.includes('?')) {
    throw new Error(
      `NEXT_PUBLIC_BASE_PATH must be an empty string or an absolute path without a query. Received: ${JSON.stringify(value)}`,
    )
  }

  return normalizedValue
}

function normalizeSiteUrl(value: string): string {
  const url = new URL(value)

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`SITE_URL must use http or https. Received: ${JSON.stringify(value)}`)
  }

  return url.toString().replace(/\/$/, '')
}

export const siteConfig = {
  name: 'nightuna dev log',
  author: 'nightuna',
  tagline: '프론트엔드 엔지니어링을 탐구하고, 실험하고, 기록합니다.',
  description:
    'React, TypeScript, 웹 플랫폼과 소프트웨어 설계를 탐구하고 실험한 결과를 기록하는 기술 블로그입니다.',
  language: 'ko',
  locale: 'ko_KR',
  siteUrl: normalizeSiteUrl(process.env.SITE_URL ?? DEFAULT_SITE_URL),
  basePath: normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? DEFAULT_BASE_PATH),
} satisfies SiteConfig

export function withBasePath(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`Public asset paths must start with "/". Received: ${JSON.stringify(path)}`)
  }

  if (
    siteConfig.basePath === '' ||
    path === siteConfig.basePath ||
    path.startsWith(`${siteConfig.basePath}/`)
  ) {
    return path
  }

  return `${siteConfig.basePath}${path}`
}
