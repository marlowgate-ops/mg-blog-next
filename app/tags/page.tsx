// app/tags/page.tsx
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const metadata = { title: 'Tags' }

export default function TagsPage() {
  const entries = new Map<string, number>()
  allPosts.forEach(p => (p.tags ?? []).forEach(t => entries.set(t, (entries.get(t) ?? 0) + 1)))

  const tags = Array.from(entries.entries()).sort((a,b) => b[1]-a[1])

  return (
    <section>
      <h1>Tags</h1>
      <ul>
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <Link href={`/tags/${encodeURIComponent(tag)}`}>#{tag}</Link> ({count})
          </li>
        ))}
      </ul>
    </section>
  )
}
