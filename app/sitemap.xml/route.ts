// app/sitemap.xml/route.ts
import { allPosts } from 'contentlayer/generated'

const SITE = { url: 'https://blog.marlowgate.com' }

export const revalidate = 300 // 5 minutes

type UrlEntry = { loc: string; lastmod?: string }

// Frontmatter の日付名ゆれに耐性
const pickDate = (p: any): string | undefined => {
  const d = p?.date ?? p?.pubDate ?? p?.publishedAt ?? p?.published
  return d ? String(d) : undefined
}

const toTime = (p: any): number => {
  const d = pickDate(p)
  return d ? new Date(d).getTime() : 0
}

export async function GET() {
  const posts = allPosts
    .filter((p: any) => !p.draft)
    .sort((a: any, b: any) => toTime(b) - toTime(a))

  // 固定ページ
  const staticUrls: UrlEntry[] = [{ loc: '/' }, { loc: '/blog/' }]

  // ページネーション（/blog/page/2 ...）
  const PER = 12
  const totalPages = Math.max(1, Math.ceil(posts.length / PER))
  const paged: UrlEntry[] = Array.from({ length: totalPages - 1 }, (_, i) => ({
    loc: `/blog/page/${i + 2}/`,
  }))

  // 記事ページ
  const postUrls: UrlEntry[] = posts.map((p: any) => ({
    loc: `/blog/${p.slug}/`,
    lastmod: pickDate(p),
  }))

  const urls: UrlEntry[] = [...staticUrls, ...paged, ...postUrls]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => {
      const loc = `${SITE.url}${u.loc}`
      const lastmod = u.lastmod ? new Date(u.lastmod).toISOString() : undefined
      return [
        '<url>',
        `<loc>${loc}</loc>`,
        lastmod ? `<lastmod>${lastmod}</lastmod>` : '',
        '</url>',
      ].join('')
    }),
    '</urlset>',
  ].join('')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=60',
    },
  })
}
