import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import styles from './list.module.css'

export const revalidate = 60

function safeDate(v?: string) {
  const t = v ? Date.parse(v) : NaN
  return isNaN(t) ? '' : new Date(t).toISOString().slice(0,10)
}
function toTime(v?: string){ const t=v?Date.parse(v):NaN; return isNaN(t)?0:t }

export default function Home() {
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a,b) => toTime(b.lastmod || b.date) - toTime(a.lastmod || a.date))
    .slice(0,12)

  return (
    <main className={styles.theme + ' ' + styles.container}>
      <h1 className={styles.h1}>Latest articles</h1>
      <p className={styles.muted}>最新の公開記事をお届けします。</p>

      {posts.length === 0 ? (
        <div className={styles.empty} style={{marginTop: 24}}>
          <p className={styles.muted}>公開記事がまだありません。最初の記事を公開すると、ここにカードで表示されます。</p>
        </div>
      ) : (
        <ul className={styles.grid} style={{marginTop: 24}}>
          {posts.map(p => (
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

      <div style={{textAlign:'center', marginTop: 28}}>
        <Link href="/blog/page/1" className={styles.btn}>すべての記事を見る</Link>
      </div>
    </main>
  )
}
