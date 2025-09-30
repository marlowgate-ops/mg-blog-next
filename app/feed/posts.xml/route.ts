import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  let posts = allPosts
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
  
  // Filter by search query if provided
  if (query) {
    const searchLower = query.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.description?.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  const lastBuildDate = new Date().toUTCString()
  const lastPostDate = posts.length > 0 ? new Date(posts[0].date).toUTCString() : lastBuildDate
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${site.title} - ブログ記事</title>
    <description>${site.description}</description>
    <link>${site.url}</link>
    <language>ja-JP</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastPostDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${site.url}/feed/posts.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${site.url}/icon.png</url>
      <title>${site.title}</title>
      <link>${site.url}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${site.url}${post.url}</link>
      <guid isPermaLink="true">${site.url}${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>contact@marlowgate.com (${site.author})</author>
      ${post.tags?.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
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