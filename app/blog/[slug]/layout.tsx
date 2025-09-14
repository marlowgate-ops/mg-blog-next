import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EndCTA from '../../components/EndCTA'
import { allPosts } from 'contentlayer/generated'
import { Mdx } from '@/components/mdx'

export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export default function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const post = allPosts.find((p) => p.slug === params.slug)
  if (!post) return notFound()

  return (
    <article>
      <Mdx code={post.body.code} />
      {/* persistent CTA at the end of each article */}
      <EndCTA />
    </article>
  )
}
