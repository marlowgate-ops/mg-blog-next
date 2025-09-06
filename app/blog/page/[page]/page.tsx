// app/blog/page/[page]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const revalidate = 60

type Params = { params: { page: string } }

// Frontmatter の日付名の揺れ（date / pubDate / publishedAt / published）に耐性を持たせる
const toTime = (p: any): number => {
  const d = p?.date ?? p?.pubDate ?? p?.publishedAt ?? p?.published
  return d ? new Date(String(d)).getTime() : 0
}

const PER_PAGE = 10  // 既存の SITE.perPage がある場合は必要に応じて統合可

export default function BlogPaged({ params }: Params) {
  const current = Number(params.page) || 1

  const posts = allPosts
    .filter((p: any) => !p.draft)
    .sort((a: any, b: any) => toTime(b) - toTime(a))

  const total = Math.max(1, Math.ceil(posts.length / PER_PAGE))
  if (current < 1 || current > total) return notFound()

  const start = (current - 1) * PER_PAGE
  const pagePosts = posts.slice(start, start + PER_PAGE)

  return (
    <section className="prose">
      <h1>Blog</h1>
      <ul>
        {pagePosts.map((p: any) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            {p.description ? <p>{p.description}</p> : null}
          </li>
        ))}
      </ul>

      <nav style={{ display: 'flex', gap: 12 }}>
        {current > 1 && (
          <Link href={current - 1 === 1 ? '/blog' : `/blog/page/${current - 1}`}>
            ← Prev
          </Link>
        )}
        {current < total && (
          <Link href={`/blog/page/${current + 1}`}>
            Next →
          </Link>
        )}
      </nav>
    </section>
  )
}
