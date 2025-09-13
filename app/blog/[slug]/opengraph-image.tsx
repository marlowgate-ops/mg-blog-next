import { ImageResponse } from 'next/og'
import { allPosts } from 'contentlayer/generated'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image({ params }: { params: { slug: string } }) {
  const post: any =
    (allPosts as any[]).find(
      (p: any) =>
        p.slug === params.slug ||
        p.slugAsParams === params.slug ||
        p._raw?.flattenedPath?.endsWith(params.slug)
    ) || null

  const title = (post?.title as string) || 'Marlow Gate'
  const desc =
    (post?.description as string) || 'Readable insights. Practical playbooks.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.7 }}>Marlow Gate</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, opacity: 0.85, maxWidth: 980 }}>{desc}</div>
        </div>
      </div>
    ),
    size
  )
}
