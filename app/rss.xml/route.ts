import { NextResponse } from 'next/server'
import { allPosts } from 'contentlayer/generated'
import { sortedPosts, pickDate } from '@/lib/post'

export const revalidate = 60

function esc(s: string) {
  return s.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c] as string))
}

export async function GET() {
  const items = sortedPosts(allPosts).slice(0, 50).map(p => {
    const url = `https://blog.marlowgate.com/blog/${p.slug}`
    const pub = pickDate(p) ?? new Date().toISOString()
    const desc = p.description ?? ''
    return `
      <item>
        <title>${esc(p.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${new Date(pub).toUTCString()}</pubDate>
        <description><![CDATA[${desc}]]></description>
      </item>
    `
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Marlow Gate — Blog</title>
    <link>https://blog.marlowgate.com/</link>
    <description>Latest articles and updates from Marlow Gate</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
