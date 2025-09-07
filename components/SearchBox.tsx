'use client'

import React from 'react'
import Link from 'next/link'

type Item = { title: string; description: string; slug: string; url: string; date: string; tags: string[] }

function normalize(s: string) {
  return (s || '').toLowerCase().replace(/\s+/g, '')
}
function ngrams(text: string, n: number): Set<string> {
  const s = normalize(text)
  const out = new Set<string>()
  for (let i = 0; i <= Math.max(0, s.length - n); i++) out.add(s.slice(i, i + n))
  return out
}
function jaccard(a: Set<string>, b: Set<string>) {
  if (!a.size && !b.size) return 0
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  return inter / (a.size + b.size - inter || 1)
}
function score(q: string, it: Item) {
  const q2 = ngrams(q, 2); const q3 = ngrams(q, 3)
  const t2 = ngrams(it.title + ' ' + it.description + ' ' + (it.tags||[]).join(' '), 2)
  const t3 = ngrams(it.title + ' ' + it.description + ' ' + (it.tags||[]).join(' '), 3)
  const sim = 0.6 * jaccard(q2, t2) + 0.4 * jaccard(q3, t3)
  // slight recency boost (last 180 days)
  const day = Math.abs((+new Date() - +new Date(it.date)) / (1000*60*60*24))
  const recency = 1 / (1 + day / 180)
  return sim * 10 + recency
}

export default function SearchBox() {
  const [q, setQ] = React.useState('')
  const [items, setItems] = React.useState<Item[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let alive = true
    fetch('/search.json')
      .then(r => r.json())
      .then(d => { if (alive) { setItems(d.items || []); setLoading(false) } })
      .catch(() => setLoading(false))
    return () => { alive = false }
  }, [])

  const results = React.useMemo(() => {
    const query = q.trim()
    if (!query) return items.slice(0, 20)
    const ranked = items.map(it => ({ it, s: score(query, it) }))
      .sort((a,b)=> b.s - a.s)
      .slice(0, 20)
      .map(r => r.it)
    return ranked
  }, [q, items])

  return (
    <div>
      <div className="mb-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="キーワード（記事タイトル・要約・タグ）"
          className="w-full rounded-xl border px-4 py-3"
          aria-label="検索"
        />
      </div>
      {loading ? <div className="text-sm text-neutral-500">読み込み中…</div> : null}
      <ul className="grid gap-4">
        {results.map(p => (
          <li key={p.slug} className="rounded-2xl border p-4 hover:shadow transition">
            <h2 className="font-semibold"><Link href={p.url}>{p.title}</Link></h2>
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{p.description}</p>
            <div className="text-xs text-neutral-500 mt-2 flex items-center gap-2">
              <span>{new Date(p.date).toISOString().slice(0,10)}</span>
              <span>·</span>
              <span className="flex flex-wrap gap-2">
                {(p.tags || []).slice(0,3).map(t => (
                  <span key={t} className="rounded-full border px-2 py-0.5">{t}</span>
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
