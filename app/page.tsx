import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const dynamic = 'force-static'

export default function HomePage() {
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 9)

  const tags = Array.from(new Set(allPosts.flatMap(p => p.tags || []))).slice(0, 16)

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Marlow Gate Blog</h1>
        <p className="text-neutral-600 mt-2">Trading tech, products, and ops — fast notes & deep dives.</p>
        {tags.length ? (
          <div className="mt-4 text-sm flex flex-wrap gap-2">
            {tags.map(t => (
              <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="rounded-full border px-3 py-1 hover:bg-neutral-50">{t}</Link>
            ))}
          </div>
        ) : null}
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {posts.map(p => (
          <li key={p._id} className="rounded-2xl border p-5 hover:shadow">
            <h2 className="text-xl font-semibold">
              <Link href={p.url}>{p.title}</Link>
            </h2>
            <p className="text-sm text-neutral-600 mt-2 line-clamp-3">{p.description}</p>
            <div className="text-xs text-neutral-500 mt-3">{new Date(p.date).toISOString().slice(0,10)}</div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link href="/blog/page/1" className="text-sm underline">All posts</Link>
        {' · '}
        <Link href="/sitemap.xml" className="text-sm underline">Sitemap</Link>
        {' · '}
        <Link href="/rss.xml" className="text-sm underline">RSS</Link>
      </div>
    </section>
  )
}
