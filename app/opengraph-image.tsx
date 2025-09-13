import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 } as const

const BRAND = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || '知見を価値に、読みやすく。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  fg: '#0b1324',
  bgA: '#e0f2fe',
  bgB: '#f0f9ff',
  accent: '#0ea5e9',
}

export default function OG() {
  const { width, height } = size
  return new ImageResponse(
    (
      <div
        style={{
          width, height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${BRAND.bgA}, ${BRAND.bgB})`,
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 16, height: 16, borderRadius: 9999,
            backgroundColor: BRAND.accent, boxShadow: '0 0 30px rgba(14,165,233,.6)'
          }} />
          <div style={{ fontSize: 28, color: BRAND.fg, opacity: .8 }}>{BRAND.url.replace(/^https?:\/\//,'')}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, color: BRAND.fg }}>
            {BRAND.name}
          </div>
          <div style={{ fontSize: 36, color: BRAND.fg, opacity: .86 }}>{BRAND.tagline}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, color: BRAND.fg, opacity: .75 }}>
            {new Date().getFullYear()} © {BRAND.name}
          </div>
          <div style={{
            padding: '10px 18px', borderRadius: 9999,
            backgroundColor: BRAND.accent, color: '#fff', fontSize: 24, fontWeight: 700
          }}>BLOG</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
