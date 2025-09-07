// app/tags/page.tsx
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const revalidate = 60

// 投稿の tags 配列からその場でタグ頻度を集計する（lib/posts への依存を無くす）
function buildTagMap() {
  const map: Record<string, number> = {}
  for (const p of allPosts) {
    const tags = (p as any).tags as string[] | undefined
    if (!tags) continue
    for (const t of tags) {
      map[t] = (map[t] ?? 0) + 1
    }
  }
  return map
}

export default function TagsPage() {
  const tagMap = buildTagMap()
  const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1])

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">Tags</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <Link href={`/tags/${tag}`} className="underline">
              {tag} <span className="text-gray-500">({count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
