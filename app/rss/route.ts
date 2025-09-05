import { allPosts } from '@/.contentlayer/generated'
import { SITE } from '@/lib/site'

export const revalidate = 60

export async function GET(){
  const posts = allPosts
    .filter(p => !p.draft)
  const items = posts.map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE.url}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}/</guid>
      <pubDate>${new Date(p.pubDate||Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[${p.description||''}]]></description>
    </item>
  `).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${SITE.url}/</link>
    <description>${escapeXml(SITE.description)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`
  return new Response(xml, { headers:{ 'Content-Type':'application/rss+xml; charset=utf-8' }})
}

function escapeXml(s:string){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}
