import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { components } from '@/lib/mdx-components'
import TOC from '@/components/TOC'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedPosts from '@/components/RelatedPosts'
import PostFooterCTA from '@/components/PostFooterCTA'
import { site } from '@/lib/site'
import { titleDescSimilarity } from '@/lib/similarity'

export const dynamicParams = false

export function generateStaticParams() {
  return allPosts.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug)
  if (!post || post.draft) return {}
  const url = `${site.url}${post.url}`
  const lastmod = post.lastmod ?? post.date
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(lastmod).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug)
  if (!post || post.draft) notFound()

  const MDX = useMDXComponent(post.body.code)
  const lastmod = post.lastmod ?? post.date

  // BlogPosting JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(lastmod).toISOString(),
    author: site.author ? [{ '@type': 'Person', name: site.author }] : undefined,
    publisher: site.brand?.name ? { '@type': 'Organization', name: site.brand?.name } : undefined,
    mainEntityOfPage: `${site.url}${post.url}`,
    url: `${site.url}${post.url}`,
  }

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog/page/1` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${site.url}${post.url}` },
    ],
  }

  // Related posts (tags + recency + semantic similarity)
  const tagSet = new Set(post.tags || [])
  const candidates = allPosts.filter((p) => !p.draft && p.slug !== post.slug)
  const scored = candidates.map((p) => {
    const overlap = (p.tags || []).filter((t) => tagSet.has(t)).length
    const dayDiff = Math.abs(+new Date(p.date) - +new Date(post.date)) / (1000 * 60 * 60 * 24)
    const recencyScore = 1 / (1 + dayDiff / 180)
    const sim = titleDescSimilarity(
      `${post.title} ${post.description || ''}`,
      '',
      `${p.title} ${p.description || ''}`,
      ''
    )
    const score = overlap * 2 + recencyScore + sim * 3
    return { p, score }
  })
  const related = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ p }) => ({ title: p.title, url: p.url, date: p.date, description: p.description }))

  return (
    <article>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog/page/1' }, { name: post.title }]} />
      <h1 className="text-3xl font-extrabold mt-2 mb-6">{post.title}</h1>

      {post.description ? <p className="text-neutral-600 mb-6">{post.description}</p> : null}

      <div className="text-xs text-neutral-500 mb-8">
        <span>公開: {new Date(post.date).toLocaleDateString('ja-JP')}</span>
        {post.lastmod ? (
          <span className="ml-3">更新: {new Date(post.lastmod).toLocaleDateString('ja-JP')}</span>
        ) : null}
        {post.readingTimeMins ? <span className="ml-3">読む時間: 約{post.readingTimeMins}分</span> : null}
      </div>

      {post.headings?.length ? <TOC headings={post.headings as any} /> : null}

      <div className="prose prose-neutral dark:prose-invert">
        <MDX components={components} />
      </div>

      {post.tags?.length ? (
        <div className="mt-8 text-sm flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <a
              key={t}
              className="rounded-full border px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              href={`/tags/${encodeURIComponent(t)}`}
            >
              {t}
            </a>
          ))}
        </div>
      ) : null}

      <PostFooterCTA />
      <RelatedPosts items={related} />
    </article>
  )
}
