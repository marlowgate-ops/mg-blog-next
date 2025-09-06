// app/rss.xml/route.ts
import { allPosts } from 'contentlayer/generated'

const SITE = {
  url: 'https://blog.marlowgate.com',
  title: 'Marlow Gate — Blog',
  description: 'Latest articles and updates from Marlow Gate',
}

const toTime = (post: any): number => {
  const d = post?.date ?? post?.pubDate ?? post?.publishedAt ?? post?.published
  return d ? new Date(String(d)).getTime() : 0
}

const toRssDate = (post: any): string | undefined => {
  const d = post?.date ?? post?.pubDate ?? post?.publishedAt ?? post?.published
  return d ? new Date(String(d)).toUTCString() : undefined
}

export const revalidate = 300 // 5 minutes

export async function GET() {
  // 最新順に並べてドラフトは除外、最大 50 件
  const posts = allPosts
    .filter((p: any) => !p.draft)
    .sort((a: any, b: any) => toTime(b) - toTime(a))
    .slice(0, 50)

  const items = posts
    .map((p: any) => {
      const link = `${SITE.url}/blog/${p.slug}`
      const pub = toRssDate(p)
      return [
        '<item>',
        `<title><![CDATA[${p.title}]]></title>`,
        `<link>${link}</link>`,
        `<guid>${link}</guid>`,
        p.description ? `<description><![CDATA[${p.description}]]></description>` : '',
        pub ? `<pubDate>${pub}</pubDate>` : '',
        '</item>',
      ].join('')
    })
    .join('')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title><![CDATA[${SITE.title}]]></title>`,
    `<link>${SITE.url}</link>`,
    `<description><![CDATA[${SITE.description}]]></description>`,
    items,
    '</channel>',
    '</rss>',
  ].join('')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=60',
    },
  })
}
