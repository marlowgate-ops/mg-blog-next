import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 } as const

async function getPost(slug: string) {
  try {
    const mod: any = await import('contentlayer/generated')
    const all = (mod.allPosts || mod.allArticles || mod.allDocs || []) as any[]
    return all.find((p) => String(p.slug || p.slugAsParams || p._raw?.flattenedPath) === slug) || null
  } catch {
    return null
  }
}

export default async function OG({ params }: { params: { slug: string } }) {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate'
  const accent = '#0ea5e9'
  const bgA = '#f5faff'
  const bgB = '#e6f4ff'
  const post = await getPost(params.slug)
  const title = (post?.title || params.slug || 'Article').slice(0, 120)
  const desc = (post?.description || '').slice(0, 140)
  const dateStr = post?.date ? new Date(post.date).toLocaleDateString('ja-JP') : ''

  const { width, height } = size
  return new ImageResponse(
    (
      <div
        style={{
          width, height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${bgA}, ${bgB})`,
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 16, height: 16, borderRadius: 9999,
            backgroundColor: accent, boxShadow: '0 0 30px rgba(14,165,233,.6)'
          }} />
          <div style={{ fontSize: 28, color: '#0b1324', opacity: .8 }}>{site}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 60, fontWeight: 800, color: '#0b1324', lineHeight: 1.12 }}>
            {title}
          </div>
          {desc ? (
            <div style={{ fontSize: 30, color: '#0b1324', opacity: .78 }}>
              {desc}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, color: '#0b1324', opacity: .75 }}>
            {dateStr}
          </div>
          <div style={{
            padding: '10px 18px', borderRadius: 9999,
            backgroundColor: accent, color: '#fff', fontSize: 24, fontWeight: 700
          }}>READ</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
