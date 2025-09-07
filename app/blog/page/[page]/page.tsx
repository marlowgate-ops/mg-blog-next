import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'

export const dynamic = 'force-static'
const PAGE_SIZE = 10

export function generateStaticParams() {
  const posts = allPosts.filter(p => !p.draft).length
  const pages = Math.max(1, Math.ceil(posts / PAGE_SIZE))
  return Array.from({length: pages}, (_,i)=>({ page: String(i+1) }))
}

export default function BlogPaged({ params }: { params: { page: string } }) {
  const page = Math.max(1, parseInt(params.page || '1', 10))
  const posts = allPosts
    .filter(p => !p.draft)
    .sort((a,b) => +new Date(b.date) - +new Date(a.date))
  const start = (page-1)*PAGE_SIZE
  const pagePosts = posts.slice(start, start+PAGE_SIZE)
  const pages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-neutral-600">Latest posts and guides.</p>
      </header>
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

      <nav className="mt-10 flex items-center justify-between">
        <div>{page>1 && <Link className="underline" href={`/blog/page/${page-1}`}>← Prev</Link>}</div>
        <div className="text-sm text-neutral-600">Page {page} / {pages}</div>
        <div>{page<pages && <Link className="underline" href={`/blog/page/${page+1}`}>Next →</Link>}</div>
      </nav>
    </section>
  )
}
