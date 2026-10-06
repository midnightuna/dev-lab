import type { ReactNode } from 'react'

import { siteConfig } from '@/config/site'

import '@/styles/global.css'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteConfig.language}>
      <body>{children}</body>
    </html>
  )
}
