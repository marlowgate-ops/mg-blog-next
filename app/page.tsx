import Link from 'next/link'
import HeroMiniCTA from '@/components/HeroMiniCTA'
import { allPosts } from 'contentlayer/generated'

export const revalidate = 60

function safeDateLabel(value?: string): string {
  if (!value) return ''
  const t = Date.parse(value)
  if (isNaN(t)) return ''
  return new Date(t).toISOString().slice(0, 10)
}

function toTime(value?: string): number {
  const t = value ? Date.parse(value) : NaN
  return isNaN(t) ? 0 : t
}

export default function Home() {
  const posts = allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => (toTime(b.lastmod || b.date) - toTime(a.lastmod || a.date)))
    .slice(0, 12)

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Latest articles</h1>
        <p className="mt-2 text-neutral-600">最新の公開記事をお届けします。</p>
        <div className="mt-6"><HeroMiniCTA /></div>
      </section>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((p) => (
          <li key={p._id}>
            <Link href={p.url} className="group block rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow transition-all bg-white/60 dark:bg-neutral-950/60">
              <h2 className="text-lg font-semibold leading-snug group-hover:underline">{p.title}</h2>
              {p.description ? (
                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.description}</p>
              ) : null}
              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                <time>{safeDateLabel(p.lastmod || p.date)}</time>
                {p.readingTimeMins ? <span>・約{p.readingTimeMins}分</span> : null}
              </div>
              {Array.isArray(p.tags) && p.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Link href="/blog/page/1" className="inline-block rounded-full border px-5 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
          すべての記事を見る
        </Link>
      </div>
    </main>
  )
}
