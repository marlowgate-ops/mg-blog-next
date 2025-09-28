import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
