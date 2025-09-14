import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const name = process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate – Blog'
  const shortName = 'MG Blog'
  const description =
    process.env.NEXT_PUBLIC_SITE_TAGLINE || '読むたびに価値が積み上がる。'
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.marlowgate.com'

  return {
    name,
    short_name: shortName,
    description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    id: base,
  }
}
