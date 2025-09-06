export const revalidate = 60

export async function GET() {
  const body = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://blog.marlowgate.com/sitemap.xml

# Feed (crawler の補助用)
Sitemap: https://blog.marlowgate.com/rss.xml
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
