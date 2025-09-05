import type { NextConfig } from 'next'
import { withContentlayer } from 'contentlayer/source-files/next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false
  }
}

export default withContentlayer(nextConfig)
