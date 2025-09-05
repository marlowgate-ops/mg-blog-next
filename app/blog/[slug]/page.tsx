// app/blog/[slug]/page.tsx
import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CTA from '@/components/CTA'

export const revalidate = 60

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug && !p.draft)
  if (!post) return notFound()

  return (
    <article className="prose">
      <h1>{post.title}</h1>
      {post.description ? <p>{post.description}</p> : null}

      {/* CTA to your store or LP */}
      <CTA />

      <p style={{ marginTop: 24 }}>
        <Link href="/blog">← Back to Blog</Link>
      </p>
    </article>
  )
}
