import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { components } from '@/lib/mdx-components'
import TOC from '@/components/TOC'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedPosts from '@/components/RelatedPosts'
import { site } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return allPosts.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug)
  if (!post) return {}
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
      description: post.description
    }
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug)
  if (!post || post.draft) notFound()
  const MDX = useMDXComponent(post.body.code)
  const lastmod = post.lastmod ?? post.date

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(lastmod).toISOString(),
    author: [{ '@type': 'Person', name: site.author }],
    publisher: { '@type': 'Organization', name: site.brand?.name },
    mainEntityOfPage: `${site.url}${post.url}`,
    url: `${site.url}${post.url}`
  }

  // Related posts (tag overlap + recency)
  const tagSet = new Set(post.tags || [])
  const candidates = allPosts
    .filter(p => !p.draft && p.slug !== post.slug)

  const scored = candidates.map((p) => {
    const overlap = (p.tags || []).filter(t => tagSet.has(t)).length
    const dayDiff = Math.abs((+new Date(p.date)) - (+new Date(post.date))) / (1000*60*60*24)
    const recencyScore = 1 / (1 + dayDiff / 180) // half-life ~6 months
    const score = overlap * 2 + recencyScore
    return { p, score }
  })

  const related = scored
    .sort((a,b)=> b.score - a.score)
    .slice(0,3)
    .map(({p}) => ({ title: p.title, url: p.url, date: p.date, description: p.description }))

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{name:'Home', href:'/'}, {name:'Blog', href:'/blog/page/1'}, {name: post.title}]} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="text-sm text-neutral-600 mt-2 flex gap-3">
          <span>{new Date(post.date).toISOString().slice(0,10)}</span>
          <span>・{post.readingTimeMins} min</span>
        </div>
      </header>
      <TOC headings={post.headings as any} />
      <div className="prose prose-neutral max-w-none">
        <MDX components={components} />
      </div>
      {post.tags?.length ? (
        <div className="mt-8 text-sm flex flex-wrap gap-2">
          {post.tags.map(t => (
            <a key={t} className="rounded-full border px-3 py-1 hover:bg-neutral-50" href={`/tags/${encodeURIComponent(t)}`}>{t}</a>
          ))}
        </div>
      ) : null}
      <RelatedPosts items={related} />
    </article>
  )
}
