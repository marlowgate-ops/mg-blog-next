import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const dynamic = 'force-static'
const PAGE_SIZE = 10

export function generateStaticParams() {
  const posts = allPosts.filter(p => !p.draft).length
  const pages = Math.max(1, Math.ceil(posts / PAGE_SIZE))
  return Array.from({length: pages}, (_,i) => ({ page: String(i+1) }))
}

function safeDateLabel(v?: string) {
  if (!v) return ''
  const t = Date.parse(v)
  return isNaN(t) ? '' : new Date(t).toISOString().slice(0,10)
}

export default function BlogPaged({ params }: { params: { page: string } }) {
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const posts = allPosts.filter(p => !p.draft).sort((a,b) => +new Date(b.date) - +new Date(a.date))
  const start = (page - 1) * PAGE_SIZE
  const pagePosts = posts.slice(start, start + PAGE_SIZE)
  const pages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))

  return (
    <section className="container">
      <h1 className="h1">All articles</h1>

      <ul className="grid" style={{marginTop: '24px'}}>
        {pagePosts.map(p => (
          <li key={p._id}>
            <Link href={p.url} className="card" style={{display:'block'}}>
              <h2 className="h2" style={{fontSize:'1.05rem'}}>{p.title}</h2>
              {p.description ? <p className="muted" style={{marginTop: '8px'}}>{p.description}</p> : null}
              <div className="small muted" style={{marginTop: '12px', display:'flex', gap:'10px'}}>
                <time>{safeDateLabel(p.lastmod || p.date)}</time>
                {p.readingTimeMins ? <span className="nowrap">・約{p.readingTimeMins}分</span> : null}
              </div>
              {Array.isArray(p.tags) && p.tags.length ? (
                <div className="chips">
                  {p.tags.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <nav className="small muted" style={{display:'flex', justifyContent:'space-between', marginTop:'28px'}}>
        <div>{page > 1 && <Link className="btn" href={`/blog/page/${page-1}`}>← Prev</Link>}</div>
        <div>Page {page} / {pages}</div>
        <div>{page < pages && <Link className="btn" href={`/blog/page/${page+1}`}>Next →</Link>}</div>
      </nav>
    </section>
  )
}
