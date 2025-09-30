import { site } from '@/lib/site'

export const revalidate = 60

export async function GET() {
  const base = site.url?.replace(/\/$/, '') || ''
  const body = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${base}/sitemap.xml

# Feeds
Sitemap: ${base}/rss.xml
Sitemap: ${base}/feed/posts.xml
Sitemap: ${base}/feed/news.xml

# OpenSearch
Allow: /opensearch.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
