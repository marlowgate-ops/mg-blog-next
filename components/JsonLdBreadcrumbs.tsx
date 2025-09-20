'use client'
import { usePathname } from 'next/navigation'

/**
 * BreadcrumbList JSON-LD (absolute URLs, valid types)
 * - Ensures the root item has a proper URL (not an empty string)
 * - Builds each segment with an absolute URL based on NEXT_PUBLIC_SITE_URL
 */
export default function JsonLdBreadcrumbs() {
  const pathname = usePathname() || '/'
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.marlowgate.com').replace(/\/$/, '')
  const segments = pathname.split('/').filter(Boolean)

  // Build absolute path step by step
  let pathAcc = ''
  const itemListElement: any[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
  ]
  segments.forEach((seg, idx) => {
    pathAcc += `/${seg}`
    itemListElement.push({
      '@type': 'ListItem',
      position: idx + 2,
      name: decodeURIComponent(seg),
      item: `${base}${pathAcc}/`,
    })
  })

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON string
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
