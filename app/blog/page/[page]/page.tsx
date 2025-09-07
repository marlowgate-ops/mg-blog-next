// app/blog/page/[page]/page.tsx
import Link from 'next/link'
import { paginate, published } from '@/lib/blog'
import Pagination from '@/components/Pagination'

export const revalidate = 60

export async function generateStaticParams() {
  const perPage = 10
  const pages = Math.max(1, Math.ceil(published.length / perPage))
  return Array.from({ length: pages }, (_, i) => ({ page: String(i + 1) }))
}

export default function BlogIndex({ params }: { params: { page: string } }) {
  const current = Math.max(1, Number(params.page) || 1)
  const { items, pages, total } = paginate(current)

  return (
    <section className="prose">
      <h1>Latest articles</h1>
      <p>{total} posts</p>
      <ul>
        {items.map(p => (
          <li key={p._id} style={{ marginBottom: 14 }}>
            <div>
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </div>
            <small>{new Date(p.date).toLocaleDateString('en-CA')}</small>
            {p.description ? <div>{p.description}</div> : null}
          </li>
        ))}
      </ul>

      <Pagination current={current} pages={pages} basePath="/blog/page" />
    </section>
  )
}
