import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'

type SitemapEntry = {
  loc: string;
  lastmod: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export const GET = async () => {
  const posts = allPosts.filter(p=>!p.draft)
  const tags = Array.from(new Set(posts.flatMap(p => p.tags || [])))
  
  // High priority static pages
  const staticPages: SitemapEntry[] = [
    { loc: site.url, lastmod: new Date().toISOString(), priority: 1.0, changefreq: 'daily' },
    { loc: `${site.url}/best/forex-brokers-jp`, lastmod: new Date().toISOString(), priority: 1.0, changefreq: 'weekly' },
    { loc: `${site.url}/insurance`, lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'weekly' },
    { loc: `${site.url}/markets`, lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'daily' },
    { loc: `${site.url}/news`, lastmod: new Date().toISOString(), priority: 0.9, changefreq: 'hourly' },
    { loc: `${site.url}/best`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    { loc: `${site.url}/reviews`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    { loc: `${site.url}/guides`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    { loc: `${site.url}/topics`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'monthly' },
    { loc: `${site.url}/search`, lastmod: new Date().toISOString(), priority: 0.6, changefreq: 'monthly' },
    
    // Tools section
    { loc: `${site.url}/tools`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    { loc: `${site.url}/tools/position-size-calculator`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'monthly' },
    { loc: `${site.url}/tools/pip-value-calculator`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'monthly' },
    { loc: `${site.url}/tools/margin-calculator`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'monthly' },
    
    // Best section pages
    { loc: `${site.url}/best/app`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    { loc: `${site.url}/best/campaigns`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'daily' },
    { loc: `${site.url}/best/low-spread`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    { loc: `${site.url}/best/tools`, lastmod: new Date().toISOString(), priority: 0.8, changefreq: 'weekly' },
    
    // Insurance comparison pages
    { loc: `${site.url}/insurance/compare/auto`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'weekly' },
    { loc: `${site.url}/insurance/compare/life`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'weekly' },
    { loc: `${site.url}/insurance/compare/medical`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'weekly' },
    
    // Blog pages
    { loc: `${site.url}/blog`, lastmod: new Date().toISOString(), priority: 0.7, changefreq: 'daily' },
    { loc: `${site.url}/blog/page/1`, lastmod: new Date().toISOString(), priority: 0.6, changefreq: 'daily' },
    
    // Legal pages
    { loc: `${site.url}/about`, lastmod: new Date().toISOString(), priority: 0.5, changefreq: 'monthly' },
    { loc: `${site.url}/contact`, lastmod: new Date().toISOString(), priority: 0.5, changefreq: 'monthly' },
    { loc: `${site.url}/privacy`, lastmod: new Date().toISOString(), priority: 0.4, changefreq: 'yearly' },
    { loc: `${site.url}/terms`, lastmod: new Date().toISOString(), priority: 0.4, changefreq: 'yearly' },
    { loc: `${site.url}/disclaimer`, lastmod: new Date().toISOString(), priority: 0.4, changefreq: 'yearly' },
    { loc: `${site.url}/policy`, lastmod: new Date().toISOString(), priority: 0.4, changefreq: 'yearly' },
    { loc: `${site.url}/disclosure`, lastmod: new Date().toISOString(), priority: 0.4, changefreq: 'yearly' },
    
    // Feeds and OpenSearch
    { loc: `${site.url}/opensearch.xml`, lastmod: new Date().toISOString(), priority: 0.3, changefreq: 'monthly' },
    { loc: `${site.url}/feed/posts.xml`, lastmod: new Date().toISOString(), priority: 0.3, changefreq: 'daily' },
    { loc: `${site.url}/feed/news.xml`, lastmod: new Date().toISOString(), priority: 0.3, changefreq: 'hourly' },
  ]
  
  const urls: SitemapEntry[] = [
    ...staticPages,
    ...posts.map(p => ({ 
      loc: `${site.url}${p.url}`, 
      lastmod: new Date((p.lastmod ?? p.date)).toISOString(),
      priority: 0.6,
      changefreq: 'monthly' as const
    })),
    ...tags.map(t => ({ 
      loc: `${site.url}/tags/${encodeURIComponent(t)}`, 
      lastmod: new Date().toISOString(),
      priority: 0.5,
      changefreq: 'weekly' as const
    })),
    ...tags.map(t => ({ 
      loc: `${site.url}/feed/tags/${encodeURIComponent(t)}.xml`, 
      lastmod: new Date().toISOString(),
      priority: 0.3,
      changefreq: 'daily' as const
    })),
  ]
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority.toFixed(1)}</priority><changefreq>${u.changefreq}</changefreq></url>`).join('\n')}
  </urlset>`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } })
}
