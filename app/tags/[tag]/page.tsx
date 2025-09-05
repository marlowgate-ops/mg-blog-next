import { allPosts } from '@/.contentlayer/generated'
import { PostCard } from '@/components/PostCard'

export const revalidate = 60

export default function TagPage({ params }:{ params:{ tag:string } }){
  const tag = decodeURIComponent(params.tag)
  const posts = allPosts
    .filter(p => !p.draft && (p.tags||[]).map(String).includes(tag))
    .sort((a,b)=> +new Date(b.pubDate) - +new Date(a.pubDate))
  return (
    <main>
      <header style={{ maxWidth:980, margin:'0 auto', padding:'28px 20px' }}>
        <h1 style={{ margin:'0 0 8px 0' }}>Tag: {tag}</h1>
      </header>
      <section style={{ padding:'0 20px 28px' }}>
        <div style={{ maxWidth:980, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr', gap:16 }}>
          {posts.map(p => (
            <PostCard key={p._id} href={`/blog/${p.slug}`} title={p.title} description={p.description} date={p.pubDate} tags={p.tags as string[]|undefined} />
          ))}
        </div>
      </section>
    </main>
  )
}
