// app/tags/[tag]/page.tsx
import Link from 'next/link'
import { allTags, byTag } from '@/lib/blog'

export const revalidate = 60

export async function generateStaticParams() {
  return allTags().map(t => ({ tag: t }))
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = byTag(params.tag)

  return (
    <section className="prose">
      <h1># {decodeURIComponent(params.tag)}</h1>
      {posts.length === 0 ? <p>No posts yet.</p> : null}
      <ul>
        {posts.map(p => (
          <li key={p._id} style={{ marginBottom: 14 }}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            <small style={{ marginLeft: 8 }}>
              {new Date(p.date).toLocaleDateString('en-CA')}
            </small>
          </li>
        ))}
      </ul>
      <p><Link href="/blog">← Back to list</Link></p>
    </section>
  )
}
