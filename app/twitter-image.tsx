/* Twitter/X default image (safe route) */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
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
          background: 'radial-gradient(1000px 600px at 20% 20%, rgba(255,255,255,.08), transparent), linear-gradient(135deg, #0ea5e9, #0f172a)',
          color: '#e2e8f0',
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 26, marginTop: 12, opacity: 0.9 }}>
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  )
}
