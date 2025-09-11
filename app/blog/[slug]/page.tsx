import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import listStyles from '../../list.module.css'
import styles from './article.module.css'
import MDXRenderer from '../../../components/MDXRenderer'
import { blogPostingLD, breadcrumbLD } from '../../../lib/jsonld'

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: (p as any).slugAsParams ?? p.slug }))
}

function getPost(slug: string) {
  return allPosts.find((p) => ((p as any).slugAsParams ?? p.slug) === slug) ?? null
}

function fmtISO(v?: string) {
  const t = v ? Date.parse(v) : NaN
  return isNaN(t) ? undefined : new Date(t).toISOString()
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) return notFound()

  // prev / next
  const sorted = allPosts.filter(p=>!p.draft).sort((a,b)=> +new Date(a.date) - +new Date(b.date))
  const idx = sorted.findIndex(p => p._id === post._id)
  const prev = idx > 0 ? sorted[idx-1] : null
  const next = idx >= 0 && idx < sorted.length-1 ? sorted[idx+1] : null

  const CTA_URL = process.env.NEXT_PUBLIC_CTA_URL || '/'
  const CTA_LABEL = process.env.NEXT_PUBLIC_CTA_LABEL || '詳細を見る'
  const CTA_BENEFITS = process.env.NEXT_PUBLIC_CTA_BENEFITS || ''

  // Safe meta
  const origin = 'https://blog.marlowgate.com'
  const url = `${origin}${post.url}`
  const rt = typeof (post as any).readingTimeMins === 'number' ? (post as any).readingTimeMins as number : undefined

  const ldPost = blogPostingLD({
    headline: post.title,
    url,
    description: post.description,
    datePublished: fmtISO(post.date),
    dateModified: fmtISO((post as any).lastmod || post.date),
    image: (post as any).image
  })
  const ldCrumbs = breadcrumbLD([
    { name: 'Home', url: `${origin}/` },
    { name: 'Blog', url: `${origin}/blog/page/1` },
    { name: post.title, url }
  ])

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
          {post.date ? <time>{(fmtISO((post as any).lastmod || post.date) || '').slice(0,10)}</time> : null}
          {typeof rt === 'number' ? <span className={styles.tag}>約{rt}分</span> : null}
          {Array.isArray((post as any).tags) && (post as any).tags.length ? (
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {(post as any).tags.map((t: string) => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          ) : null}
        </div>

        <article className={styles.prose}>
          <MDXRenderer code={post.body.code} />
        </article>

        <nav className={styles.nav}>
          <div>{prev && <Link className={listStyles.btnGhost} href={(prev as any).url}>← {prev.title}</Link>}</div>
          <div style={{flex:1}} />
          <div>{next && <Link className={listStyles.btnGhost} href={(next as any).url}>{next.title} →</Link>}</div>
        </nav>
        <div className={styles.note}>前後の記事で関連性を高め、回遊性と滞在時間を伸ばします。</div>

        <div className={listStyles.ctaBand} style={{marginTop: 30}}>
          <div>
            <div className={listStyles.ctaTitle}>業務テンプレ｜ICS検証ノート</div>
            {CTA_BENEFITS ? <div className={listStyles.ctaBenefits}>{CTA_BENEFITS}</div> : null}
          </div>
          <div><Link href={CTA_URL} className={listStyles.btnPrimary}>{CTA_LABEL}</Link></div>
        </div>

        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldPost) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldCrumbs) }} />
      </section>
    </main>
  )
}
