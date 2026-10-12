import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter, SiteHeader } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { defaultOpenGraphImagePath, getMetadataAlternates, toSiteUrl } from '@/lib/publishing'
import { routes } from '@/lib/routes'

import '@/styles/global.css'

interface RootLayoutProps {
  children: ReactNode
}

const defaultOpenGraphImage = {
  url: toSiteUrl(defaultOpenGraphImagePath),
  width: 1200,
  height: 630,
  alt: siteConfig.name,
}

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.siteUrl}/`),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  alternates: getMetadataAlternates(routes.home),
  openGraph: {
    type: 'website',
    url: toSiteUrl(routes.home),
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultOpenGraphImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteConfig.language} data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
