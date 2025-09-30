import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {
  if (!params?.slug) {
    return new Response('Tag not found', { status: 404 })
  }
  
  const tag = decodeURIComponent(params.slug)
  
  const postsWithTag = allPosts
    .filter(p => !p.draft && p.tags?.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15) // Limit to 15 items for tag feeds
  
  const lastBuildDate = new Date().toUTCString()
  const lastPostDate = postsWithTag.length > 0 ? new Date(postsWithTag[0].date).toUTCString() : lastBuildDate
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${site.title} - タグ: ${tag}</title>
    <description>${tag}に関する記事 - ${site.description}</description>
    <link>${site.url}/tags/${encodeURIComponent(tag)}</link>
    <language>ja-JP</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastPostDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${site.url}/feed/tags/${encodeURIComponent(tag)}.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${site.url}/icon.png</url>
      <title>${site.title}</title>
      <link>${site.url}/tags/${encodeURIComponent(tag)}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${postsWithTag.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${site.url}${post.url}</link>
      <guid isPermaLink="true">${site.url}${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>contact@marlowgate.com (${site.author})</author>
      <category><![CDATA[${tag}]]></category>
      ${post.tags?.filter(t => t !== tag).map(t => `<category><![CDATA[${t}]]></category>`).join('') || ''}
      ${post.description ? `<content:encoded><![CDATA[${post.description}]]></content:encoded>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600', // 1 hour
    },
  })
}

export async function generateStaticParams() {
  const tags = Array.from(new Set(
    allPosts
      .filter(p => !p.draft)
      .flatMap(p => p.tags || [])
  ))
  
  return tags.map(tag => ({
    slug: encodeURIComponent(tag)
  }))
}