import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { sortedPosts } from '@/lib/post'

const PAGE_SIZE = 10
export const revalidate = 60

export default function BlogIndex() {
  const posts = sortedPosts(allPosts)
  const pagePosts = posts.slice(0, PAGE_SIZE)

  return (
    <section>
      <h1>Blog</h1>
      <ul>
        {pagePosts.map(p => (
          <li key={p._id}>
            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            {p.description && <p>{p.description}</p>}
          </li>
        ))}
      </ul>
      {posts.length > PAGE_SIZE && <p><Link href="/blog/page/2">Older posts →</Link></p>}
    </section>
  )
}
