// app/tags/[tag]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { publishedPosts } from '@/lib/posts'

export const revalidate = 300

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const items = publishedPosts.filter(p => (p.tags ?? []).includes(tag))
  if (!items.length) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">Tag: {tag}</h1>
      <ul className="space-y-4">
        {items.map(p => (
          <li key={p.slug} className="border rounded-lg p-4">
            <h2 className="text-lg font-medium">
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            {p.description && <p className="text-sm mt-1">{p.description}</p>}
          </li>
        ))}
      </ul>
      <div className="mt-6"><Link href="/tags" className="underline">← All tags</Link></div>
    </main>
  )
}
