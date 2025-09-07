import { ImageResponse } from '@vercel/og'
import { site } from '@/lib/site'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 64,
          background: 'white'
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 16 }}>{site.title}</div>
        <div style={{ fontSize: 28, color: '#111' }}>{site.description}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
