import { site } from '@/lib/site'

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'week'
  const providers = searchParams.get('providers')?.split(',').filter(Boolean) || []
  
  try {
    // Fetch news from our API
    const apiUrl = new URL('/api/news', site.url)
    apiUrl.searchParams.set('period', period)
    if (providers.length > 0) {
      apiUrl.searchParams.set('providers', providers.join(','))
    }
    
    const response = await fetch(apiUrl.toString(), {
      next: { revalidate: 3600 } // 1 hour
    })
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`)
    }
    
    const newsData = await response.json()
    const newsItems = newsData.items || []
    const latest20 = newsItems.slice(0, 20)
    
    const lastBuildDate = new Date().toUTCString()
    const lastNewsDate = latest20.length > 0 ? new Date(latest20[0].publishedAt).toUTCString() : lastBuildDate
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.title} - FX・投資ニュース</title>
    <description>FX・投資・資産運用に関する最新ニュース</description>
    <link>${site.url}/news</link>
    <language>ja-JP</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${lastNewsDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${site.url}/feed/news.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${site.url}/icon.png</url>
      <title>${site.title}</title>
      <link>${site.url}/news</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${latest20.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.sourceName} からの最新ニュース]]></description>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <author>contact@marlowgate.com (${site.author})</author>
      <category><![CDATA[${item.sourceName}]]></category>
      <category><![CDATA[FX]]></category>
      <category><![CDATA[投資]]></category>
    </item>`).join('')}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=3600', // 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating news RSS:', error)
    
    // Fallback empty RSS
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${site.title} - FX・投資ニュース</title>
    <description>FX・投資・資産運用に関する最新ニュース</description>
    <link>${site.url}/news</link>
    <language>ja-JP</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`
    
    return new Response(fallbackRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes for error case
      },
    })
  }
}