import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const revalidate = 60

function safeDateLabel(v?: string) {
  if (!v) return ''
  const t = Date.parse(v)
  return isNaN(t) ? '' : new Date(t).toISOString().slice(0,10)
}
function toTime(v?: string) {
  const t = v ? Date.parse(v) : NaN
  return isNaN(t) ? 0 : t
}

export default function Home() {
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a,b) => toTime(b.lastmod || b.date) - toTime(a.lastmod || a.date))
    .slice(0,12)

  return (
    <main className="container">
      <header>
        <h1 className="h1">Latest articles</h1>
        <p className="muted">最新の公開記事をお届けします。</p>
      </header>

      <ul className="grid" style={{marginTop: '24px'}}>
        {posts.map(p => (
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

      <div style={{textAlign:'center', marginTop:'28px'}}>
        <Link href="/blog/page/1" className="btn">すべての記事を見る</Link>
      </div>
    </main>
  )
}
