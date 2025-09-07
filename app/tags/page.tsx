// app/tags/page.tsx
import Link from 'next/link'
import { tagMap } from '@/lib/posts'

export const revalidate = 300

export default function Tags() {
  const m = [...tagMap().entries()].sort((a, b) => b[1] - a[1])
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-semibold mb-6">Tags</h1>
      <ul className="flex flex-wrap gap-3">
        {m.map(([tag, count]) => (
          <li key={tag}>
            <Link href={`/tags/${tag}`} className="rounded border px-3 py-1 text-sm">
              {tag} <span className="text-neutral-500">({count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
