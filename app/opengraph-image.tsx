import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate – Blog'
  const tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Readable insights. Practical playbooks.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 48,
          backgroundColor: '#0b1220',
          color: '#e6f1ff',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.9 }}>blog.marlowgate.com</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>{site}</div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>{tagline}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 22 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              backgroundColor: '#11243a',
              color: '#7dd3fc',
            }}
          >
            Marlow Gate
          </div>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              backgroundColor: '#1a2a44',
              color: '#e2e8f0',
            }}
          >
            Read • Build • Ship
          </div>
        </div>
      </div>
    ),
    size
  )
}
