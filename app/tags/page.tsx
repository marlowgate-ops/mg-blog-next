import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { TAG_META } from '@/lib/tag-meta'

export const dynamic = 'force-static'

export default function TagsIndexPage() {
  const map = new Map<string, number>()
  for (const p of allPosts) {
    if (p.draft) continue
    for (const t of (p.tags || [])) {
      map.set(t, (map.get(t) || 0) + 1)
    }
  }
  const entries = Array.from(map.entries()).sort((a,b)=> b[1]-a[1])

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">タグ一覧</h1>
        <p className="text-neutral-600">よく読まれているトピックから順に表示しています。</p>
      </header>

      <ul className="grid gap-4">
        {entries.map(([t, count]) => {
          const meta = TAG_META[t]
          return (
            <li key={t} className="rounded-2xl border p-5 hover:shadow transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    <Link href={`/tags/${encodeURIComponent(t)}`}>{meta?.title || t}</Link>
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">{meta?.description || 'タグ解説は準備中です。'}</p>
                </div>
                <div className="text-xs text-neutral-500 shrink-0">{count}件</div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
