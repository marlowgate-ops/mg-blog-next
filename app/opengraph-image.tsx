/* OG default image for the whole site (safe: adds route only) */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  const title = process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate – Blog'
  const tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || '読むたびに価値が積み上がる。'

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
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0f172a 100%)',
          color: '#e2e8f0',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, marginTop: 10, opacity: 0.9 }}>
          {tagline}
        </div>
        <div style={{ position: 'absolute', left: 64, bottom: 56, fontSize: 20, opacity: 0.75 }}>
          {process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.marlowgate.com'}
        </div>
      </div>
    ),
    { ...size }
  )
}
