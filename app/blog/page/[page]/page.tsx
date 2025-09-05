import { allPosts } from '@/.contentlayer/generated'
import { SITE } from '@/lib/site'
import { PostCard } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default function BlogPage({ params }:{ params:{ page: string } }){
  const current = Number(params.page||'1')
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a,b)=> +new Date(b.pubDate) - +new Date(a.pubDate))
  const total = Math.max(1, Math.ceil(posts.length / SITE.perPage))
  if(current < 1 || current > total) return notFound()
  const start = (current-1) * SITE.perPage
  const pageItems = posts.slice(start, start + SITE.perPage)

  return (
    <main>
      <header style={{ maxWidth:980, margin:'0 auto', padding:'28px 20px' }}>
        <h1 style={{ margin:'0 0 8px 0' }}>All posts — Page {current}</h1>
      </header>
      <section style={{ padding:'0 20px 28px' }}>
        <div style={{ maxWidth:980, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr', gap:16 }}>
          {pageItems.map(p => (
            <PostCard key={p._id} href={`/blog/${p.slug}`} title={p.title} description={p.description} date={p.pubDate} tags={p.tags as string[]|undefined} />
          ))}
        </div>
      </section>
      <Pagination current={current} total={total} />
    </main>
  )
}
