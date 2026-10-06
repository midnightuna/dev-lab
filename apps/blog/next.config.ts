import type { NextConfig } from 'next'

import { siteConfig } from './src/config/site'

const nextConfig: NextConfig = {
  agentRules: false,
  basePath: siteConfig.basePath,
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
}

export default nextConfig
