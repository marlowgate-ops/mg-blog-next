
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const dynamic = 'force-static'
const PAGE_SIZE = 10

export function generateStaticParams() {
  const posts = allPosts.filter(p=>!p.draft).length
  const pages = Math.max(1, Math.ceil(posts / PAGE_SIZE))
  return Array.from({length: pages}, (_, i) => ({ page: String(i+1) }))
}

function safeDate(v?: string) { const t = v ? Date.parse(v) : NaN; return isNaN(t) ? '' : new Date(t).toISOString().slice(0,10) }

export default function BlogPaged({ params }: { params: { page: string } }) {
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const posts = allPosts.filter(p=>!p.draft).sort((a,b)=> +new Date(b.date) - +new Date(a.date))
  const start = (page-1)*PAGE_SIZE
  const pagePosts = posts.slice(start, start+PAGE_SIZE)
  const pages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))

  return (
    <section className="container">
      <h1 className="h1">All articles</h1>

      {pagePosts.length === 0 ? (
        <div className="empty" style={{marginTop:'24px'}}>
          <p className="muted">公開記事がまだありません。</p>
        </div>
      ) : (
        <ul className="grid" style={{marginTop:'24px'}}>
          {pagePosts.map(p => (
            <li key={p._id}>
              <Link href={p.url} className="card" style={{display:'block'}}>
                <h2 style={{fontWeight:700, fontSize:'1.05rem'}}>{p.title}</h2>
                {p.description ? <p className="muted" style={{marginTop:'8px'}}>{p.description}</p> : null}
                <div className="small muted" style={{marginTop:'12px', display:'flex', gap:'10px'}}>
                  <time>{safeDate(p.lastmod || p.date)}</time>
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
      )}

      <nav className="small muted" style={{display:'flex', justifyContent:'space-between', marginTop:'28px'}}>
        <div>{page > 1 && <Link className="btn" href={`/blog/page/${page-1}`}>← Prev</Link>}</div>
        <div>Page {page} / {pages}</div>
        <div>{page < pages && <Link className="btn" href={`/blog/page/${page+1}`}>Next →</Link>}</div>
      </nav>

      
<style jsx global>{`
  :root {
    --bg: #ffffff; --fg: #0a0a0a; --muted: #6b7280; --border: #e5e7eb; --card: #ffffff; --hover: #f3f4f6;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0a0a0a; --fg:#fafafa; --muted:#a3a3a3; --border:#2a2a2a; --card:#0f0f0f; --hover:#161616; }
  }
  html,body{background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Noto Sans,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";}
  .container{max-width:1040px;margin:0 auto;padding:48px 20px;}
  .h1{font-size:2rem;font-weight:800;letter-spacing:-.01em;}
  .muted{color:var(--muted);}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
  .card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:20px;transition:box-shadow .2s,transform .2s;}
  .card:hover{box-shadow:0 1px 2px rgba(0,0,0,.04),0 6px 20px rgba(0,0,0,.06);transform:translateY(-1px);}
  .btn{display:inline-block;border:1px solid var(--border);padding:8px 14px;border-radius:999px;text-decoration:none}
  .btn:hover{background:var(--hover);}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
  .chip{display:inline-block;border:1px solid var(--border);padding:2px 8px;border-radius:9999px;font-size:12px;color:var(--muted);}
  .small{font-size:12px;}
  .nowrap{white-space:nowrap;}
  .empty{border:1px dashed var(--border);border-radius:18px;padding:28px;text-align:center;background:transparent}
`}</style>

    </section>
  )
}
