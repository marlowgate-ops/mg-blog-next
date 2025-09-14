import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Marlow Gate – Blog'
  const tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE ?? '読むたびに価値が積み上がる。'
  const accent = process.env.NEXT_PUBLIC_BRAND_ACCENT ?? '#0EA5E9'
  const domain = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.marlowgate.com')
    .replace(/^https?:\/\//, '').replace(/\/$/, '')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2f2ff 100%)',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            letterSpacing: -1.2,
            color: '#0f172a',
            lineHeight: 1.2,
          }}
        >
          {site}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: '#334155',
            fontWeight: 500,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            position: 'absolute',
            right: 64,
            bottom: 64,
            padding: '12px 20px',
            background: accent,
            color: '#fff',
            borderRadius: 16,
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          {domain}
        </div>
      </div>
    ),
    size
  )
}
