import { allPosts } from '@/.contentlayer/generated'
import { SITE } from '@/lib/site'

export const revalidate = 60

export async function GET(){
  const urls: string[] = []
  const url = (loc:string, lastmod?:string) => `<url><loc>${loc}</loc>${lastmod?`<lastmod>${lastmod}</lastmod>`:''}<changefreq>daily</changefreq></url>`
  urls.push(url(`${SITE.url}/`))
  urls.push(url(`${SITE.url}/blog/`))
  urls.push(url(`${SITE.url}/about`))
  urls.push(url(`${SITE.url}/rss.xml`))

  const PER = 12
  const posts = allPosts.filter(p=>!p.draft).sort((a,b)=> +new Date(b.pubDate) - +new Date(a.pubDate))
  const totalPages = Math.max(1, Math.ceil(posts.length / PER))
  for(let i=2;i<=totalPages;i++){
    urls.push(url(`${SITE.url}/blog/page/${i}/`))
  }

  const tagSet = new Set<string>()
  for(const p of posts){
    for(const t of (p.tags||[])) tagSet.add(String(t))
  }
  for(const t of tagSet){
    urls.push(url(`${SITE.url}/tags/${encodeURIComponent(t)}/`))
  }

  for(const p of posts){
    const loc = `${SITE.url}/blog/${p.slug}/`
    const mod = p.updatedDate ? new Date(p.updatedDate as any).toISOString() : undefined
    urls.push(url(loc, mod))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  return new Response(xml, { headers:{ 'Content-Type':'application/xml; charset=utf-8' } })
}
