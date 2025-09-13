import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function toTitle(slug: string) {
  return slug.replace(/[-_]/g,' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default async function Image({ params }: { params: { slug: string } }) {
  let title = toTitle(params.slug)
  let desc = 'Readable insights. Practical playbooks.'
  try {
    // contentlayer がある前提だが、型やエクスポート名差異に耐性を持たせる
    const mod: any = await import('contentlayer/generated')
    const col = mod.allPosts || mod.allArticles || mod.allDocs || []
    const post: any = col.find((p: any) => p.slug === params.slug || p.slugAsParams === params.slug || p._raw?.flattenedPath?.endsWith(params.slug))
    if (post) {
      title = String(post.title ?? title)
      if (post.description) desc = String(post.description)
    }
  } catch {}

  return new ImageResponse(
    (<div style={{
        width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between',
        padding:64, background:'radial-gradient(1200px 600px at 10% -20%, #e0f2fe, transparent), radial-gradient(1200px 600px at 110% 120%, #fef3c7, transparent), #ffffff',
        color:'#0f172a', border:'1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: 42, fontWeight: 700, opacity: 0.7 }}>Marlow Gate</div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05, maxWidth: 980 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.8, maxWidth: 980 }}>{desc}</div>
      </div>
    </div>),
    size
  )
}
