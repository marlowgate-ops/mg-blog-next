import { ImageResponse } from '@vercel/og'
import { site } from '@/lib/site'

export const runtime = 'edge'

export async function GET() {
  const title = site.title || 'Marlow Gate'
  const desc = site.description || ''

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          border: '20px solid #111'
        }}
      >
        <div style={{ display: 'flex', padding: 48, gap: 36, alignItems: 'center' }}>
          <div style={{ width: 16, height: 16, background: '#111' }} />
          <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1 }}>{title}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', padding: '0 48px 48px 48px' }}>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.3,
              color: '#111',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {desc}
          </div>
        </div>
        <div style={{ padding: '0 48px 48px 48px', color: '#555', fontSize: 24 }}>
          {site.url?.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
