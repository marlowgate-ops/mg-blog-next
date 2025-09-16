import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import listStyles from '../../list.module.css'
import styles from './article.module.css'
import MDXRenderer from '../../../components/MDXRenderer'
import { blogPostingLD, breadcrumbLD } from '../../../lib/jsonld'

export function generateStaticParams() {
  const list = Array.isArray(allPosts) ? allPosts : []
  return list.map((p: any) => ({ slug: p.slugAsParams ?? p.slug }))
}

function getPost(slug: string) {
  const list = Array.isArray(allPosts) ? allPosts : []
  return list.find((p: any) => (p.slugAsParams ?? p.slug) === slug) ?? null
}

type PageProps = { params: { slug: string } }

export default function Page({ params }: PageProps) {
  const post: any = getPost(params.slug)
  if (!post) return notFound()

  const ldPost = blogPostingLD({
    title: post.title,
    description: post.description || '',
    url: `https://blog.marlowgate.com${post.url || `/blog/${params.slug}`}`,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    authorName: 'Marlow Gate'
  })
  const ldCrumbs = breadcrumbLD([
    { name: 'ホーム', item: 'https://blog.marlowgate.com/' },
    { name: 'ブログ', item: 'https://blog.marlowgate.com/blog/' },
    { name: post.title }
  ])

  const CTA_URL = process.env.NEXT_PUBLIC_ARTICLE_CTA_URL || ''
  const CTA_LABEL = process.env.NEXT_PUBLIC_ARTICLE_CTA_LABEL || ''
  const CTA_BENEFITS = process.env.NEXT_PUBLIC_ARTICLE_CTA_BENEFITS || ''

  return (
    <main className={styles.wrap}>
      <section className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          {post.date ? <time dateTime={post.date}>{post.date}</time> : null}
        </header>

        <article className={styles.content}>
          {post?.body?.code ? <MDXRenderer code={post.body.code} /> : null}
        </article>

        {(CTA_URL && CTA_LABEL) ? (
          <div className={listStyles.ctaBox}>
            <div>
              <div className={listStyles.ctaTitle}>業務テンプレ｜ICS検証ノート</div>
              {CTA_BENEFITS ? <div className={listStyles.ctaBenefits}>{CTA_BENEFITS}</div> : null}
            </div>
            <div><Link href={CTA_URL} className={listStyles.btnPrimary}>{CTA_LABEL}</Link></div>
          </div>
        ) : null}

        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldPost) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldCrumbs) }} />
      </section>
    </main>
  )
}
