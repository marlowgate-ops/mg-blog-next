import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { site } from '@/lib/site'
import listStyles from '../../list.module.css'
import styles from './article.module.css'
import MDXRenderer from '../../../components/MDXRenderer'
import JsonLd from '../../../components/JsonLd'
import JsonLdBreadcrumbs from '../../../components/JsonLdBreadcrumbs'
import { articleSchema } from '../../../lib/seo/jsonld'

// Restrict dynamic paths strictly to generated params
export const dynamicParams = false

export function generateStaticParams() {
  const list = Array.isArray(allPosts) ? allPosts : []
  const filtered = list.filter((p: any) => {
    const name = String(p?._raw?.sourceFileName || '')
    const startsWithUnderscore = name.startsWith('_')
    const isDraft = !!p?.draft
    const slug = String(p?.slug || p?.slugAsParams || '')
    return !startsWithUnderscore && !isDraft && !!slug && slug !== 'sample-slug'
  })
  return filtered.map((p: any) => ({ slug: String(p.slug || p.slugAsParams) }))
}

function getPost(slug: string) {
  const list = Array.isArray(allPosts) ? allPosts : []
  return list.find((p: any) => String(p.slug || p.slugAsParams || '') === slug) ?? null
}

type PageProps = { params: { slug: string } }

export default function Page({ params }: PageProps) {
  const post: any = getPost(params.slug)
  if (!post) return notFound()

  // Calculate word count from content
  const wordCount = post.body?.raw ? post.body.raw.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute

  const articleData = articleSchema({
    headline: post.title,
    description: post.description || '',
    url: `${site.url}${post.url || `/blog/${params.slug}`}`,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    authorName: 'Marlow Gate編集部',
    image: post.image ? [`${site.url}${post.image}`] : undefined,
    wordCount,
    readingTime: `PT${readingTime}M`,
    category: post.category || '金融・投資',
    tags: post.tags || []
  });

  const CTA_URL = process.env.NEXT_PUBLIC_ARTICLE_CTA_URL || ''
  const CTA_LABEL = process.env.NEXT_PUBLIC_ARTICLE_CTA_LABEL || ''
  const CTA_BENEFITS = process.env.NEXT_PUBLIC_ARTICLE_CTA_BENEFITS || ''

  return (
    <>
      <JsonLd data={articleData} />
      <JsonLdBreadcrumbs />
      
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
        </section>
      </main>
    </>
  )
}
