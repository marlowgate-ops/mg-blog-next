import Link from 'next/link'
import Image from 'next/image'
import { allPosts } from 'contentlayer/generated'
import { FEATURED_SLUGS } from '@/lib/featured'

export default function FeaturedList() {
  const pick = FEATURED_SLUGS.map(s => s.trim()).filter(Boolean)
  let items = allPosts.filter(p => !p.draft)

  if (pick.length) {
    const map = new Map(items.map(p => [p.slug, p]))
    items = pick.map(s => map.get(s)).filter(Boolean) as typeof items
  } else {
    // Fallback: 最新から上位5件
    items = items.sort((a,b)=> +new Date(b.date) - +new Date(a.date)).slice(0,5)
  }

  if (!items.length) return null

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3">人気記事</h2>
      <ol className="grid gap-3 sm:grid-cols-2">
        {items.map((p, i) => (
          <li key={p._id} className="rounded-2xl border hover:shadow transition overflow-hidden">
            <Link href={p.url} className="flex items-stretch gap-0">
              <div className="shrink-0 w-32 sm:w-40 bg-neutral-50 border-r">
                <Image
                  src={`/og/${p.slug}`}
                  alt=""
                  width={320}
                  height={168}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <div className="text-xs text-neutral-500">{String(i+1).padStart(2,'0')}</div>
                <div className="font-semibold leading-snug mt-1 line-clamp-2">{p.title}</div>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{p.description}</p>
                <div className="text-xs text-neutral-500 mt-2">
                  <span>{new Date(p.date).toISOString().slice(0,10)}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
