import { site } from '@/lib/site'

export const revalidate = 60

export async function GET() {
  const base = site.url?.replace(/\/$/, '') || ''
  const body = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${base}/sitemap.xml

# Feed (crawler helper)
Sitemap: ${base}/rss.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
