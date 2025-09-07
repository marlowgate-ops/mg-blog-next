// app/blog/page.tsx  ← 1ページ目（/blog）
import Link from 'next/link'
import { paginate } from '@/lib/posts'

export const revalidate = 300
const PER_PAGE = 10

export default function BlogIndex() {
  const { items, totalPages } = paginate(1, PER_PAGE)
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">All posts</h1>
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

      {totalPages > 1 && (
        <nav className="mt-6">
          <Link href="/blog/page/2" className="underline">Older posts →</Link>
        </nav>
      )}
    </main>
  )
}
