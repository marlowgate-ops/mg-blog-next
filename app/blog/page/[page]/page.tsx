import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import styles from '../../../list.module.css'

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
    <section className={styles.container}>
      <h1 className={styles.h1}>All articles</h1>

      {pagePosts.length === 0 ? (
        <div className={styles.empty} style={{marginTop: 24}}>
          <p className={styles.muted}>公開記事がまだありません。</p>
        </div>
      ) : (
        <ul className={styles.grid} style={{marginTop: 24}}>
          {pagePosts.map(p => (
            <li key={p._id}>
              <Link href={p.url} className={styles.card}>
                <h2 style={{fontWeight:700, fontSize:'1.05rem'}}>{p.title}</h2>
                {p.description ? <p className={styles.muted} style={{marginTop: 8}}>{p.description}</p> : null}
                <div className={styles.small + ' ' + styles.muted} style={{marginTop: 12, display:'flex', gap: 10}}>
                  <time>{safeDate(p.lastmod || p.date)}</time>
                  {p.readingTimeMins ? <span className={styles.nowrap}>・約{p.readingTimeMins}分</span> : null}
                </div>
                {Array.isArray(p.tags) && p.tags.length ? (
                  <div className={styles.chips}>
                    {p.tags.map(t => <span key={t} className={styles.chip}>{t}</span>)}
                  </div>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <nav className={styles.small + ' ' + styles.muted} style={{display:'flex', justifyContent:'space-between', marginTop: 28}}>
        <div>{page > 1 && <Link className={styles.btn} href={`/blog/page/${page-1}`}>← Prev</Link>}</div>
        <div>Page {page} / {pages}</div>
        <div>{page < pages && <Link className={styles.btn} href={`/blog/page/${page+1}`}>Next →</Link>}</div>
      </nav>
    </section>
  )
}
