import { withContentlayer } from 'next-contentlayer'

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default withContentlayer(nextConfig)
