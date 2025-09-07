// app/blog/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { paginate, PER_PAGE } from '@/lib/posts'

export const metadata: Metadata = { title: 'Blog' }
export const revalidate = 60

export default function BlogIndex() {
  // paginate の戻り値は { items, total, page, perPage, pages }
  const { items, pages } = paginate(1, PER_PAGE)

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">All posts</h1>

      <ul className="space-y-6">
        {items.map((p) => (
          <li key={p.slug}>
            <h2 className="font-medium text-lg">
              <Link href={`/blog/${p.slug}`} className="underline">
                {p.title}
              </Link>
            </h2>
            {p.description && (
              <p className="text-sm text-gray-600">{p.description}</p>
            )}
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav className="mt-8">
          <Link href="/blog/page/2" className="underline">
            Next page →
          </Link>
        </nav>
      )}
    </main>
  )
}
