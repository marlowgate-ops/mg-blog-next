import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import listStyles from '../../list.module.css'
import styles from './article.module.css'

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: (p as any).slugAsParams ?? p.slug }))
}

function getPost(slug: string) {
  const post = allPosts.find((p) => ((p as any).slugAsParams ?? p.slug) === slug)
  if (!post) return null
  return post
}

function fmtDate(v?: string) {
  const t = v ? Date.parse(v) : NaN
  return isNaN(t) ? '' : new Date(t).toISOString().slice(0,10)
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) return notFound()

  const Component = useMDXComponent(post.body.code)

  // prev / next
  const sorted = allPosts.filter(p=>!p.draft).sort((a,b)=> +new Date(a.date) - +new Date(b.date))
  const idx = sorted.findIndex(p => p._id === post._id)
  const prev = idx > 0 ? sorted[idx-1] : null
  const next = idx >= 0 && idx < sorted.length-1 ? sorted[idx+1] : null

  const CTA_URL = process.env.NEXT_PUBLIC_CTA_URL || '/'
  const CTA_LABEL = process.env.NEXT_PUBLIC_CTA_LABEL || '詳細を見る'
  const CTA_BENEFITS = process.env.NEXT_PUBLIC_CTA_BENEFITS || ''

  return (
    <main className={listStyles.theme + ' ' + styles.article}>
      <section className={listStyles.container + ' ' + styles.wrap}>
        <nav className={styles.breadcrumbs}>
          <Link href='/' className={styles.crumb}>Home</Link><span className={styles.sep}>›</span>
          <Link href='/blog/page/1' className={styles.crumb}>Blog</Link><span className={styles.sep}>›</span>
          <span className={styles.crumb} style={{borderStyle:'dashed'}}>{post.title}</span>
        </nav>

        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          {post.date ? <time>{fmtDate(post.lastmod || post.date)}</time> : null}
          {Array.isArray(post.tags) && post.tags.length ? (
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {post.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          ) : null}
        </div>

        <article className={styles.prose}>
          <Component />
        </article>

        <nav className={styles.nav}>
          <div>{prev && <Link className={listStyles.btnGhost} href={prev.url}>← {prev.title}</Link>}</div>
          <div style={{flex:1}} />
          <div>{next && <Link className={listStyles.btnGhost} href={next.url}>{next.title} →</Link>}</div>
        </nav>
        <div className={styles.note}>前後の記事で関連性を高め、回遊性と滞在時間を伸ばします。</div>

        <div className={listStyles.ctaBand} style={{marginTop: 30}}>
          <div>
            <div className={listStyles.ctaTitle}>業務テンプレ｜ICS検証ノート</div>
            {CTA_BENEFITS ? <div className={listStyles.ctaBenefits}>{CTA_BENEFITS}</div> : null}
          </div>
          <div><Link href={CTA_URL} className={listStyles.btnPrimary}>{CTA_LABEL}</Link></div>
        </div>
      </section>
    </main>
  )
}
