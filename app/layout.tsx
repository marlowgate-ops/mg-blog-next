// app/layout.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.marlowgate.com'),
  title: {
    default: 'Marlow Gate — Blog',
    template: '%s | Marlow Gate — Blog',
  },
  description: 'Latest articles and updates from Marlow Gate',
  alternates: {
    canonical: 'https://blog.marlowgate.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://blog.marlowgate.com',
    siteName: 'Marlow Gate — Blog',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}

        {/* --- GA4 (Consent Mode v2: デフォルトで同意) --- */}
        {GA_ID ? (
          <>
            <Script id="consent-init" strategy="beforeInteractive">
              {`window.dataLayer=window.dataLayer||[];
               function gtag(){dataLayer.push(arguments);}
               gtag('consent', 'default', {
                 ad_storage: 'denied',
                 analytics_storage: 'granted',
                 ad_user_data: 'denied',
                 ad_personalization: 'denied',
                 functionality_storage: 'granted',
                 security_storage: 'granted'
               });`}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer=window.dataLayer||[];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
