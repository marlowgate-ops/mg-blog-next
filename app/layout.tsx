import './globals.css'
import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.title}`
  },
  description: site.description,
  alternates: {
    types: {
      'application/rss+xml': `${site.url}/rss.xml`,
    }
  },
  openGraph: { siteName: site.title },
  twitter: { site: site.twitter || undefined }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <main className="mx-auto max-w-3xl px-5 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
