import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CTA from '@/components/CTA'

export const revalidate = 60

export default function BlogPost({ params }:{ params:{ slug:string } }){
  const post = allPosts.find(p => p.slug === params.slug && !p.draft)
  if(!post) return notFound()
  const MDX = useMDXComponent(post.body.code)
  return (
  <article className="prose">
    <h1>{post.title}</h1>
    <p>{post.description}</p>
    {/* TODO: MDX 本文レンダ（後で実装）。当面は概要のみ表示 */}
    <CTA />
  </article>
)
}
