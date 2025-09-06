import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CTA from '@/components/CTA'

export const revalidate = 60

type Params = { slug: string }

export default function BlogPost({ params }: { params: Params }) {
  const post = allPosts.find(p => p.slug === params.slug && !p.draft)
  if (!post) return notFound()

  return (
    <article className="prose mx-auto py-8">
      <h1>{post.title}</h1>
      {post.description && <p>{post.description}</p>}
      {/* TODO: MDX body rendering — we will wire this up after migration */}
      <div className="mt-8"><CTA /></div>
      <p className="mt-8"><Link href="/blog">← Back to blog</Link></p>
    </article>
  )
}
