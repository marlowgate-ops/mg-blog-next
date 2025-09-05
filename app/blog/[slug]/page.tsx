import { allPosts } from '@/.contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Link from 'next/link'
import { CTA } from '@/components/CTA'

export const revalidate = 60

export default function BlogPost({ params }:{ params:{ slug:string } }){
  const post = allPosts.find(p => p.slug === params.slug && !p.draft)
  if(!post) return notFound()
  const MDX = useMDXComponent(post.body.code)
  return (
    <main>
      <article style={{ maxWidth:980, margin:'0 auto', padding:'28px 20px' }}>
        <header style={{ margin:'8px 0 16px 0' }}>
          <h1 style={{ fontSize:32, lineHeight:1.25, margin:'0 0 8px 0', fontWeight:800 }}>{post.title}</h1>
          <div style={{ color:'#666', fontSize:14, display:'flex', gap:10, flexWrap:'wrap' }}>
            {post.pubDate && <time>Published: {new Date(post.pubDate).toLocaleDateString('ja-JP')}</time>}
            {post.updatedDate && <time>Updated: {new Date(post.updatedDate).toLocaleDateString('ja-JP')}</time>}
            {post.tags && post.tags.length>0 && <span>· {post.tags.map((t,i)=>(<span key={t}><Link href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link>{i<post.tags.length-1?' ':''}</span>))}</span>}
          </div>
        </header>
        <div style={{ fontSize:18 }} className="prose">
          <MDX />
        </div>
        {post.tags && post.tags.length>0 && (
          <div style={{ marginTop:22, display:'flex', gap:8, flexWrap:'wrap' }} aria-label="Tags">
            {post.tags.map(t => (<Link key={t} href={`/tags/${encodeURIComponent(t)}`} style={{ border:'1px solid #eee', borderRadius:999, padding:'4px 10px', fontSize:12, color:'#333', textDecoration:'none' }}>#{t}</Link>))}
          </div>
        )}
        <CTA />
      </article>
    </main>
  )
}
