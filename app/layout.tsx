import './globals.css'
import type { Metadata } from 'next'
import { site } from '@/lib/site'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.title}` },
  description: site.description,
  alternates: { types: { 'application/rss+xml': `${site.url}/rss.xml` } },
  openGraph: { siteName: site.title },
  twitter: { site: site.twitter || undefined }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Organization/Website JSON-LD
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brand?.name || site.title,
    url: site.url,
    logo: site.brand?.logo || undefined,
  }
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.title,
    url: site.url
  }

  // Analytics (opt-in via env): NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <html lang="ja">
      <body className={inter.className + " min-h-screen antialiased"}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
        {gaId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{__html:`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}} />
          </>
        ) : null}
        {plausibleDomain ? (
          <script defer data-domain={plausibleDomain} src="https://plausible.io/js/plausible.js"></script>
        ) : null}
        <main className="mx-auto max-w-3xl px-5 py-10">{children}</main>
      </body>
    </html>
  )
}
