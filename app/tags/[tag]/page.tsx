// app/tags/[tag]/page.tsx
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { toTime } from '@/lib/post'

type Params = { params: { tag: string } }

export const revalidate = 60

export default function TagIndex({ params }: Params) {
  const tag = decodeURIComponent(params.tag || '').trim()
  const posts = allPosts
    .filter((p: any) => !p.draft)
    .filter((p: any) => (p.tags || []).map(String).includes(tag))
    .sort((a: any, b: any) => toTime(b) - toTime(a))

  return (
    <main className="prose">
      <h1>Tag: {tag}</h1>
      {posts.length === 0 && <p>No posts yet.</p>}
      <ul>
        {posts.map((p: any) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            {p.description ? <p>{p.description}</p> : null}
          </li>
        ))}
      </ul>
      <p><Link href="/blog">← Back to list</Link></p>
    </main>
  )
}
