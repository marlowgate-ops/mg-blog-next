import { ImageResponse } from '@vercel/og'
import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'

export const runtime = 'edge'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug)
  const title = post?.title || 'Marlow Gate'
  const desc = post?.description || site.description || ''
  const date = post ? new Date(post.date).toISOString().slice(0,10) : ''

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
          <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, maxWidth: 980 }}>{title}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', padding: '0 48px 0 48px' }}>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: '#111',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 980
            }}
          >
            {desc}
          </div>
        </div>
        <div style={{ padding: '0 48px 48px 48px', color: '#555', fontSize: 24, display: 'flex', justifyContent: 'space-between' }}>
          <div>{site.url?.replace(/^https?:\/\//, '')}</div>
          <div>{date}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
