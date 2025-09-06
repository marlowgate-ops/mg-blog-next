// app/blog/page.tsx
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const revalidate = 60

// 安全に日時を取り出す（frontmatter の名前揺れに耐性）
const toTime = (p: any): number => {
  const d = p?.date ?? p?.pubDate ?? p?.publishedAt ?? p?.published
  return d ? new Date(String(d)).getTime() : 0
}

export default function BlogIndex() {
  const posts = allPosts
    .filter((p: any) => !p.draft)
    .sort((a: any, b: any) => toTime(b) - toTime(a))

  return (
    <section className="prose">
      <h1>Blog</h1>
      <ul>
        {posts.map((p: any) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            {p.description ? <p>{p.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
