import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'

export const GET = async () => {
  const posts = allPosts.filter(p=>!p.draft)
  const tags = Array.from(new Set(posts.flatMap(p => p.tags || [])))
  
  // Static pages
  const staticPages = [
    { loc: site.url, lastmod: new Date().toISOString() },
    { loc: `${site.url}/blog/page/1`, lastmod: new Date().toISOString() },
    { loc: `${site.url}/insurance`, lastmod: new Date().toISOString() },
    { loc: `${site.url}/insurance/compare/auto`, lastmod: new Date().toISOString() },
    { loc: `${site.url}/insurance/compare/life`, lastmod: new Date().toISOString() },
    { loc: `${site.url}/insurance/compare/medical`, lastmod: new Date().toISOString() },
  ]
  
  const urls = [
    ...staticPages,
    ...posts.map(p => ({ loc: `${site.url}${p.url}`, lastmod: new Date((p.lastmod ?? p.date)).toISOString() })),
    ...tags.map(t => ({ loc: `${site.url}/tags/${encodeURIComponent(t)}`, lastmod: new Date().toISOString() })),
  ]
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
  </urlset>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } })
}
