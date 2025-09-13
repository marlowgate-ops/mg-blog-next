/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function getPost(slug: string) {
  try {
    const mod: any = await import('contentlayer/generated')
    const all: any[] = (mod.allPosts || mod.allArticles || mod.allDocs || [])
    return all.find((p: any) => String(p.slug || p.slugAsParams || p._raw?.flattenedPath) === slug)
  } catch {
    return null
  }
}

export default async function OG({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  const title = (post?.title || params.slug || '').slice(0, 80)
  const tag = (post?.tags?.[0] || post?.category || '').slice(0, 20)
  const date = post?.date ? new Date(post.date).toLocaleDateString('ja-JP') : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 48,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0b1324 50%, #020617 100%)',
          color: '#fff',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
        }}
      >
        <div style={{display:'flex', alignItems:'center', gap:12, opacity:.9, fontWeight:800}}>
          {tag ? <span style={{padding:'6px 12px', border:'2px solid rgba(255,255,255,.6)', borderRadius:9999}}>{tag}</span> : null}
          {date ? <span>{date}</span> : null}
        </div>
        <div style={{flex:1, display:'flex', alignItems:'center'}}>
          <h1 style={{fontSize: 64, lineHeight:1.1, margin:0, fontWeight:900}}>{title}</h1>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', opacity:.92}}>
          <div style={{fontSize:28, fontWeight:800}}>Marlow Gate</div>
          <div style={{fontSize:20}}>blog.marlowgate.com</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
