import './globals.css'
import type { Metadata } from 'next'
import { site } from '@/lib/site'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.title}` },
  description: site.description,
  alternates: { types: { 'application/rss+xml': `${site.url}/rss.xml` } },
  openGraph: { siteName: site.title, images: [{ url: '/og/default.png', width: 1200, height: 630 }] },
  twitter: { site: site.twitter || undefined }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

  // Analytics（GA4推奨）
  // 既存の NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GA4_ID どちらでも拾う
  const gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA4_ID
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const copyVariant = (process.env.NEXT_PUBLIC_COPY_VARIANT || 'A').toUpperCase()

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
              // 基本設定
              gtag('config', '${gaId}', { anonymize_ip: true });
              // ★A/BコピーのバリアントをUser Propertyとして送信（GA4）
              gtag('set', 'user_properties', { copy_variant: '${copyVariant}' });
              // 互換目的：page_viewにも同名パラメータを付与
              gtag('event', 'page_view', { copy_variant: '${copyVariant}' });
            `}} />
          </>
        ) : null}
        {plausibleDomain ? (
          <script defer data-domain={plausibleDomain} src="https://plausible.io/js/plausible.js"></script>
        ) : null}
        <Header />
        <main className="mx-auto max-w-3xl px-5 py-10">{children}</main>
      </body>
    </html>
  )
}
