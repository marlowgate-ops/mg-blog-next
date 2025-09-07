// app/blog/page/[page]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { paginate, PER_PAGE } from '@/lib/posts'

export const revalidate = 60

export default function BlogPaged({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page)
  if (!Number.isFinite(pageNum) || pageNum < 2) return notFound()

  // paginate の戻り値は { items, total, page, perPage, pages }
  const { items, pages, page } = paginate(pageNum, PER_PAGE)
  if (page > pages) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">All posts — page {page}</h1>
      <ul className="space-y-6">
        {items.map((p) => (
          <li key={p.slug}>
            <h2 className="font-medium text-lg">
              <Link href={`/blog/${p.slug}`} className="underline">
                {p.title}
              </Link>
            </h2>
            {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
          </li>
        ))}
      </ul>

      <nav className="mt-8 flex justify-between">
        <Link href={page === 2 ? '/blog' : `/blog/page/${page - 1}`} className="underline">
          ← Newer
        </Link>
        {page < pages && (
          <Link href={`/blog/page/${page + 1}`} className="underline">
            Older →
          </Link>
        )}
      </nav>
    </main>
  )
}
