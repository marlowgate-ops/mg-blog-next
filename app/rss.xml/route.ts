import { NextResponse } from 'next/server'
import { allPosts } from 'contentlayer/generated'

const SITE = 'https://blog.marlowgate.com'

// キャッシュ（CDN/ブラウザ）。必要に応じて調整
export const revalidate = 60 * 60 // 1h
export const dynamic = 'force-static'

function xmlEscape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET() {
  const items = allPosts
    .filter(p => !p.draft)
    .sort((a, b) => {
      const ta = new Date(p.date ?? p.publishedAt ?? 0).getTime()
      const tb = new Date(b.date ?? b.publishedAt ?? 0).getTime()
      return tb - ta
    })
    .slice(0, 100)

  const body = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Marlow Gate — Blog</title>
    <link>${SITE}/</link>
    <description>Latest articles and updates from Marlow Gate</description>
    ${items
      .map(p => {
        const url =
          p.slug?.startsWith('/blog')
            ? `${SITE}${p.slug}`
            : `${SITE}/blog/${p.slug}`
        const title = xmlEscape(p.title ?? 'Untitled')
        const desc = xmlEscape(p.description ?? '')
        const pub = new Date(p.date ?? Date.now()).toUTCString()
        return `<item>
  <title>${title}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${pub}</pubDate>
  <description><![CDATA[${desc}]]></description>
</item>`
      })
      .join('\n    ')}
  </channel>
</rss>`

  return new NextResponse(body, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control':
        'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
