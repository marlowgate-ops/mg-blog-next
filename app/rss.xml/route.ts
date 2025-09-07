import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

function strip(md: string) {
  if (!md) return ''
  return md
    .replace(/```[\s\S]*?```/g, '')     // code fences
    .replace(/`[^`]+`/g, '')             // inline code
    .replace(/\!\[[^\]]*\]\([^\)]*\)/g, '') // images
    .replace(/\[[^\]]*\]\([^\)]*\)/g, '$1')  // links -> text
    .replace(/[#>*_~\-]+/g, ' ')        // md marks
    .replace(/\s+/g, ' ')
    .trim()
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET() {
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const items = posts.map(p => {
    const raw = (p as any).body?.raw || ''
    const summarySrc = p.description || strip(raw)
    const summary = summarySrc.slice(0, 220) + (summarySrc.length > 220 ? '…' : '')
    const url = `${site.url}${p.url}`
    return `
      <item>
        <title>${esc(p.title)}</title>
        <link>${esc(url)}</link>
        <guid isPermaLink="true">${esc(url)}</guid>
        <pubDate>${new Date(p.date).toUTCString()}</pubDate>
        <description><![CDATA[${summary}]]></description>
      </item>
    `
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${esc(site.title || 'Marlow Gate')}</title>
      <link>${esc(site.url || '')}</link>
      <description>${esc(site.description || '')}</description>
      ${items}
    </channel>
  </rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600'
    }
  })
}
