import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import { lookupTag } from '@/lib/tag-meta'

export const dynamic = 'force-static'
const PAGE_SIZE = 20

export function generateStaticParams() {
  const set = new Set<string>()
  allPosts.forEach(p => p.tags?.forEach(t => set.add(t)))
  return Array.from(set).map(t => ({ tag: t }))
}

export function generateMetadata({ params }: { params: { tag: string } }) {
  const { key, meta } = lookupTag(params.tag)
  const title = meta ? `タグ: ${meta.title}` : `タグ: ${key}`
  const description = meta?.description || `「${key}」に関する記事一覧です。`
  return { title, description }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const { key, meta } = lookupTag(params.tag)

  const posts = allPosts
    .filter(p => !p.draft && (p.tags||[]).includes(key))
    .sort((a,b) => +new Date(b.date) - +new Date(a.date))

  const pagePosts = posts.slice(0, PAGE_SIZE)
  const tags = Array.from(new Set(allPosts.flatMap(p => p.tags || []))).sort()

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">タグ: {meta?.title || key}</h1>
        <p className="text-neutral-600 mt-1">{meta?.description || `「${key}」に関する記事一覧です。`}</p>
        <div className="text-sm text-neutral-500 mt-2">{posts.length}件</div>
      </header>

      <div className="mb-6 text-sm flex flex-wrap gap-2">
        {tags.map(t => (
          <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="rounded-full border px-3 py-1 hover:bg-neutral-50">{t}</Link>
        ))}
      </div>

      <ul className="grid gap-6">
        {pagePosts.map(p => (
          <li key={p._id} className="rounded-2xl border p-5 hover:shadow">
            <h2 className="text-xl font-semibold"><Link href={p.url}>{p.title}</Link></h2>
            <p className="text-sm text-neutral-600 mt-2 line-clamp-3">{p.description}</p>
            <div className="text-xs text-neutral-500 mt-3 flex gap-3">
              <span>{new Date(p.date).toISOString().slice(0,10)}</span>
              <span>・{p.readingTimeMins} min</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
