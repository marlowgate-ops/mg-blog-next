import { NextResponse } from 'next/server'
import { allPosts } from 'contentlayer/generated'
import { sortedPosts } from '@/lib/post'

export const revalidate = 60

export async function GET() {
  const base = 'https://blog.marlowgate.com'
  const statics = [
    `${base}/`,
    `${base}/blog/`,
    `${base}/about`,
    `${base}/rss.xml`,
  ].map(u => `<url><loc>${u}</loc><changefreq>daily</changefreq></url>`).join('\n')

  const posts = sortedPosts(allPosts)
    .map(p => `<url><loc>${base}/blog/${p.slug}</loc><changefreq>daily</changefreq></url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${statics}
${posts}
</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
