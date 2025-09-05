import Link from 'next/link'
import { allPosts } from 'contentlayer/generated';
import { SITE } from '@/lib/site'
import { PostCard } from '@/components/PostCard'

export const revalidate = 60

export default function BlogIndex(){
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a,b)=> +new Date(b.pubDate) - +new Date(a.pubDate))
  const pageItems = posts.slice(0, SITE.perPage)
  const total = Math.max(1, Math.ceil(posts.length / SITE.perPage))

  return (
    <main>
      <section style={{ padding:'48px 20px', background:'#fafafa', borderBottom:'1px solid #eee' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h1 style={{ margin:'0 0 12px 0', fontSize:28, lineHeight:1.25 }}>Trading data & automation — insights and releases</h1>
          <p style={{ margin:'0 0 18px 0', color:'#555' }}>Latest articles and updates from Marlow Gate</p>
          <a href="/store" style={{ display:'inline-block', padding:'10px 16px', borderRadius:10, border:'1px solid #111', textDecoration:'none', color:'#111' }}>Go to Store</a>
        </div>
      </section>
      <section style={{ padding:'28px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr', gap:16 }}>
          {pageItems.map(p => (
            <PostCard key={p._id} href={`/blog/${p.slug}`} title={p.title} description={p.description} date={p.pubDate} tags={p.tags as string[]|undefined} />
          ))}
        </div>
      </section>
      {total > 1 && <div style={{ textAlign:'center', paddingBottom:20 }}><Link href="/blog/page/2" style={{ textDecoration:'none', border:'1px solid #eee', padding:'8px 12px', borderRadius:10 }}>Next</Link></div>}
    </main>
  )
}
