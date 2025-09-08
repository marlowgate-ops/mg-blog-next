// Enable Contentlayer integration and keep strict type checking (no ignores)
import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  // keep ESLint during build optional to avoid CI noise (doesn't skip TypeScript)
  eslint: { ignoreDuringBuilds: true },
}

export default withContentlayer(nextConfig)
