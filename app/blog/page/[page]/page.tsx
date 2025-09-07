// app/blog/page/[page]/page.tsx  ← 2ページ目以降（/blog/page/2 …）
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { paginate } from '@/lib/posts'

export const revalidate = 300
const PER_PAGE = 10

export default function BlogPaged({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page)
  if (!Number.isFinite(pageNum) || pageNum < 2) return notFound()

  const { items, totalPages, page } = paginate(pageNum, PER_PAGE)
  if (page > totalPages) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">All posts — page {page}</h1>
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

      <nav className="mt-6 flex items-center justify-between">
        <Link href={page === 2 ? '/blog' : `/blog/page/${page - 1}`} className="underline">← Newer</Link>
        {page < totalPages && (
          <Link href={`/blog/page/${page + 1}`} className="underline">Older →</Link>
        )}
      </nav>
    </main>
  )
}
