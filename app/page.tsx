import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const dynamic = 'force-static'

export default function HomePage() {
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const featured = posts[0]
  const rest = posts.slice(1, 9)
  const tags = Array.from(new Set(allPosts.flatMap(p => p.tags || []))).slice(0, 16)

  return (
    <section>
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Marlow Gate Blog</h1>
        <p className="text-neutral-600 mt-3 text-lg">トレーディング技術・プロダクト・オペレーションの「勝てる手順」を最短で。</p>
        {tags.length ? (
          <div className="mt-4 text-sm flex flex-wrap gap-2">
            {tags.map(t => (
              <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="rounded-full border px-3 py-1 hover:bg-neutral-50">{t}</Link>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex gap-3">
          <Link href="/blog/page/1" className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">すべての記事</Link>
          <Link href="/rss.xml" className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">RSS</Link>
        </div>
      </header>

      {featured ? (
        <article className="mb-8 rounded-3xl border overflow-hidden hover:shadow-lg transition">
          <Link href={featured.url} className="block">
            <div className="bg-neutral-50">
              <img src={`/og/${featured.slug}`} alt="" width={1200} height={630} loading="lazy" decoding="async" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl sm:text-3xl font-semibold">{featured.title}</h2>
              <p className="text-neutral-600 mt-2 line-clamp-3">{featured.description}</p>
              <div className="text-xs text-neutral-500 mt-3 flex items-center gap-3">
                <span>{new Date(featured.date).toISOString().slice(0,10)}</span>
                {'·'}
                <span>{featured.readingTimeMins} min</span>
                {featured.tags?.slice(0,2).map(t => (
                  <span key={t} className="rounded-full border px-2 py-0.5">{t}</span>
                ))}
              </div>
            </div>
          </Link>
        </article>
      ) : null}

      <ul className="grid gap-6 sm:grid-cols-2">
        {rest.map(p => (
          <li key={p._id} className="rounded-2xl border p-5 hover:shadow transition">
            <Link href={p.url} className="block">
              <div className="mb-3 overflow-hidden rounded-xl border bg-neutral-50">
                <img src={`/og/${p.slug}`} alt="" width={600} height={315} loading="lazy" decoding="async" />
              </div>
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-sm text-neutral-600 mt-2 line-clamp-3">{p.description}</p>
              <div className="text-xs text-neutral-500 mt-3 flex items-center gap-3">
                <span>{new Date(p.date).toISOString().slice(0,10)}</span>
                {'·'}
                <span>{p.readingTimeMins} min</span>
                <span className="flex flex-wrap gap-2">
                  {(p.tags || []).slice(0,2).map(t => (
                    <span key={t} className="rounded-full border px-2 py-0.5">{t}</span>
                  ))}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
