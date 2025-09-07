import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/post'

export async function GET() {
  const posts = getAllPosts()
  const site = 'https://blog.marlowgate.com'

  const items = posts.map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description ?? ''}]]></description>
    </item>
  `).join('')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>Marlow Gate – Blog</title>
    <link>${site}/</link>
    <description>Latest articles and updates from Marlow Gate</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}

function escapeXml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}
