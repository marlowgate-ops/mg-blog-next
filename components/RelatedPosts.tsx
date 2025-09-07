import Link from 'next/link'

type Item = { title: string; url: string; date: string; description?: string }

export default function RelatedPosts({ items }: { items: Item[] }) {
  if (!items?.length) return null
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Related posts</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <li key={p.url} className="rounded-2xl border p-4 hover:shadow">
            <h3 className="font-semibold">
              <Link href={p.url}>{p.title}</Link>
            </h3>
            {p.description ? (
              <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{p.description}</p>
            ) : null}
            <div className="text-xs text-neutral-500 mt-2">{new Date(p.date).toISOString().slice(0,10)}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
