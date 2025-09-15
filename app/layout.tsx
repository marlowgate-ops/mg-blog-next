// app/layout.tsx — 完全置換（GA4軽量タグ＋パンくずJSON-LD注入の土台）
import "./globals.css";
import type { Metadata } from "next";
import { breadcrumbList } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.marlowgate.com"),
  title: { default: "Marlow Gate Blog", template: "%s — Marlow Gate" },
  description: "Templates, data, and trading ops — faster, safer, repeatable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const COPY_VAR = process.env.NEXT_PUBLIC_COPY_VARIANT ?? "A";
  const breadcrumb = breadcrumbList([
    { name: "Home", item: "https://blog.marlowgate.com/" }
  ]);
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
        {GA_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { 'user_properties': { copy_variant: '${COPY_VAR}' } });
              `}}
            />
          </>
        ) : null}
      </head>
      <body>
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
