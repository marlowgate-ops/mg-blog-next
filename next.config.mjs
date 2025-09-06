// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    // 旧パス → 新パス（例）
    { source: '/src/content/blog/:slug*', destination: '/blog/:slug*', permanent: true },
    { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
  ],
}

export default nextConfig
