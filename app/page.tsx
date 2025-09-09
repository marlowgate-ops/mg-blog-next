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
    <main className={styles.theme}>
      <section className={styles.container + ' ' + styles.hero}>
        <h1 className={styles.heroTitle}>Latest articles</h1>
        <p className={styles.heroSub}>最新の公開記事をお届けします。読みやすさと実用性を両立した、ここでしか読めないノウハウを。</p>
        <div className={styles.ctaRow}>
          <Link href="/blog/page/1" className={styles.btnPrimary}>すべての記事を見る</Link>
          <Link href="/" className={styles.btnGhost}>トップへ</Link>
        </div>
      </section>

      <section className={styles.container}>
        {posts.length === 0 ? (
          <ul className={styles.grid}>
            {Array.from({length: 3}).map((_,i)=>(
              <li key={i} className={styles.card + ' ' + styles.skeleton}>
                <div className={styles.skelTitle}></div>
                <div className={styles.skelLine}></div>
                <div className={styles.skelLine} style={{width:'75%'}}></div>
                <div className={styles.skelChips}>
                  <div className={styles.skelChip}></div>
                  <div className={styles.skelChip}></div>
                  <div className={styles.skelChip}></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.grid}>
            {posts.map(p => (
              <li key={p._id}>
                <Link href={p.url} className={styles.card}>
                  <h2 style={{fontWeight:800, fontSize:'1.08rem'}}>{p.title}</h2>
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
      </section>
    </main>
  )
}
