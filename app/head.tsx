// Site‑wide head tags (safe addition: no changes to existing layout.tsx)
export default function Head() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Marlow Gate – Blog'
  const tagline =
    process.env.NEXT_PUBLIC_SITE_TAGLINE ?? '読むたびに価値が積み上がる。'
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.marlowgate.com'

  const title = site
  const description = tagline
  const ogImage = `${base}/opengraph-image`
  const twImage = `${base}/twitter-image`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />

      {/* Canonical */}
      <link rel="canonical" href={base} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={base} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twImage} />

      {/* Misc */}
      <meta name="theme-color" content="#0ea5e9" />
      <link rel="icon" href="/favicon.ico" />

      {/* Language alternates (baseline) */}
      <link rel="alternate" hrefLang="ja" href={base} />
      <link rel="alternate" hrefLang="x-default" href={base} />
    </>
  )
}
