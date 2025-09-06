// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import CTA from '@/components/CTA'

type Params = { params: { slug: string } }

export async function generateStaticParams() {
  return allPosts.filter(p => !p.draft).map(p => ({ slug: p.slug }))
}

export const revalidate = 60

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = allPosts.find(p => p.slug === params.slug && !p.draft)
  if (!post) return { title: 'Not found' }

  const url = `https://blog.marlowgate.com/blog/${post.slug}`

  return {
    title: post.title,
    description: post.description ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description ?? undefined,
      images: [`https://blog.marlowgate.com/og/${post.slug}.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description ?? undefined,
      images: [`https://blog.marlowgate.com/og/${post.slug}.png`],
    },
  }
}

export default function BlogPost({ params }: Params) {
  const post = allPosts.find(p => p.slug === params.slug && !p.draft)
  if (!post) return null

  const url = `https://blog.marlowgate.com/blog/${post.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description ?? '',
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Marlow Gate' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  }

  return (
    <article className="prose">
      <h1>{post.title}</h1>
      {post.description ? <p>{post.description}</p> : null}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* TODO: MDX 本文レンダ（後で再導入）。いまは安全に本文は非表示 */}
      <p style={{opacity:.7}}>本文は準備中です。</p>

      <CTA />
      <p><Link href="/blog">← Back to list</Link></p>
    </article>
  )
}
