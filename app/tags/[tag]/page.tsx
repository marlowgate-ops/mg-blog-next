import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { toTime } from '@/lib/post'

type Params = { params: { tag: string } }
export const revalidate = 60

export default function TagPage({ params }: Params) {
  const tag = decodeURIComponent(params.tag)
  const posts = allPosts
    .filter(p => !(p as any).draft)
    .filter(p => ((p as any).tags ?? []).map(String).includes(tag))
    .sort((a, b) => toTime(b) - toTime(a))

  return (
    <section>
      <h1>Tag: {tag}</h1>
      <ul>
        {posts.map(p => (
          <li key={p._id}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            {p.description && <p>{p.description}</p>}
          </li>
        ))}
      </ul>
      <p><Link href="/blog">← Back to list</Link></p>
    </section>
  )
}
