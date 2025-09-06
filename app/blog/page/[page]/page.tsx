import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { sortedPosts } from '@/lib/post'

const PAGE_SIZE = 10
export const revalidate = 60

type Params = { params: { page: string } }

export default function BlogPaged({ params }: Params) {
  const page = Math.max(1, parseInt(params.page, 10) || 1)
  const posts = sortedPosts(allPosts)
  const start = (page - 1) * PAGE_SIZE
  const slice = posts.slice(start, start + PAGE_SIZE)

  if (slice.length === 0) return null

  return (
    <section>
      <h1>Blog — page {page}</h1>
      <ul>
        {slice.map(p => (
          <li key={p._id}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            {p.description && <p>{p.description}</p>}
          </li>
        ))}
      </ul>
      <nav style={{ display: 'flex', gap: 12 }}>
        {page > 1 && <Link href={page === 2 ? '/blog' : `/blog/page/${page - 1}`}>← Newer</Link>}
        {start + PAGE_SIZE < posts.length && <Link href={`/blog/page/${page + 1}`}>Older →</Link>}
      </nav>
    </section>
  )
}
