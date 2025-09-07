// app/page.tsx
import Link from 'next/link'
import { publishedPosts } from '@/lib/posts'

export const revalidate = 300

export default function Home() {
  const latest = publishedPosts.slice(0, 5)
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold">Marlow Gate — Blog</h1>
        <p className="text-neutral-600">
          Trading data & automation — insights and releases
        </p>
        <nav className="mt-3 flex gap-4 text-sm">
          <Link href="/blog">All posts</Link>
          <Link href="/tags">Tags</Link>
          <Link href="/about">About</Link>
          <Link href="/rss.xml">RSS</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </nav>
      </header>

      <section className="space-y-4">
        {latest.map(p => (
          <article key={p.slug} className="border rounded-lg p-4">
            <h2 className="text-lg font-medium">
              <Link href={`/blog/${p.slug}`}>{p.title}</Link>
            </h2>
            {p.description && (
              <p className="text-sm text-neutral-700 mt-1">{p.description}</p>
            )}
            <div className="mt-2 text-xs text-neutral-500">
              {new Date(p.date).toISOString().slice(0, 10)}
              {p.tags?.length ? (
                <> · {p.tags.map(t => <Link key={t} href={`/tags/${t}`} className="underline mr-1">{t}</Link>)}</>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6">
        <Link href="/blog" className="underline">View all posts →</Link>
      </div>
    </main>
  )
}
