// app/robots.txt/route.ts
export const dynamic = 'force-static'
export const revalidate = 60 * 60 // 1h

const SITE = 'https://blog.marlowgate.com'

export function GET() {
  const body = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE}/sitemap.xml

# Feed (crawler の補助用)
Sitemap: ${SITE}/rss.xml
`

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control':
        'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
