import type { ReactNode } from 'react'

import { SiteFooter, SiteHeader } from '@/components/site-shell'
import { siteConfig } from '@/config/site'

import '@/styles/global.css'

interface RootLayoutProps {
  children: ReactNode
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
