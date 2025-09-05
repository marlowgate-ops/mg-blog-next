import { ImageResponse } from '@vercel/og'
import { allPosts } from '@/.contentlayer/generated'

export const runtime = 'edge'
export const revalidate = 60

export async function GET(req: Request, { params }:{ params:{ slug:string } }){
  const post = allPosts.find(p => p.slug === params.slug)
  const title = post?.title || 'Marlow Gate'
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630, display:'flex', flexDirection:'column',
          justifyContent:'center', alignItems:'center', background:'#F8FAFC', color:'#111'
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, marginBottom: 12, textAlign:'center', padding:'0 80px' }}>{title}</div>
        <div style={{ fontSize: 24 }}>Marlow Gate — Trading data & automation</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
