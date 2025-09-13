import Link from 'next/link'
import s from '../../list.module.css'

const PAGE_SIZE = 9

async function getAll() {
  try {
    const mod: any = await import('contentlayer/generated')
    const all: any[] = (mod.allPosts || mod.allArticles || mod.allDocs || [])
    const sorted = [...all].sort((a,b) => {
      const da = new Date(a.date || 0).getTime()
      const db = new Date(b.date || 0).getTime()
      return db - da
    })
    return sorted
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const all = await getAll()
  const total = Math.max(1, Math.ceil(all.length / PAGE_SIZE))
  return Array.from({ length: total }, (_, i) => ({ page: String(i + 1) }))
}

export default async function BlogList({ params }: { params: { page: string } }) {
  const current = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const all = await getAll()
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE))
  const start = (current - 1) * PAGE_SIZE
  const slice = all.slice(start, start + PAGE_SIZE)

  return (
    <main className={s.wrap}>
      <header className={s.head}>
        <h1 className={s.title}>All articles</h1>
        <p className={s.lead}>Page {current} / {totalPages}</p>
      </header>

      <section className={s.grid}>
        {slice.length === 0
          ? Array.from({length: 6}).map((_,i) => <div key={i} className={s.skeleton} />)
          : slice.map((post: any) => <Card key={String(post._id || post.slug)} post={post} />)}
      </section>

      <nav className={s.pager} aria-label="Pagination">
        <Chip href={`/blog/page/${Math.max(1, current - 1)}`} label="Prev" ghost disabled={current===1} />
        {getPages(current, totalPages).map((p) => (
          <Chip key={p} href={`/blog/page/${p}`} label={String(p)} active={p===current} />
        ))}
        <Chip href={`/blog/page/${Math.min(totalPages, current + 1)}`} label="Next" ghost disabled={current===totalPages} />
      </nav>
    </main>
  )
}

function getPages(curr: number, total: number) {
  const range = 2
  const pages: number[] = []
  const start = Math.max(1, curr - range)
  const end = Math.min(total, curr + range)
  for (let i = start; i <= end; i++) pages.push(i)
  if (!pages.includes(1)) pages.unshift(1)
  if (!pages.includes(total)) pages.push(total)
  return Array.from(new Set(pages)).sort((a,b)=>a-b)
}

function Card({ post }: { post: any }) {
  const slug = String(post.slug || post.slugAsParams || post._raw?.flattenedPath || '')
  const href = '/blog/' + slug
  const date = post.date ? new Date(post.date).toLocaleDateString('ja-JP') : ''
  const tag = (post.tags && post.tags[0]) || post.category || null
  const desc = (post.description || '').slice(0, 120)
  return (
    <Link className={s.card} href={href}>
      <div>
        <div className={s.ctitle}>{post.title || slug}</div>
        <div className={s.desc}>{desc}</div>
      </div>
      <div className={s.meta}>
        {tag ? <span className={s.pill}>{String(tag)}</span> : null}
        {date ? <span>{date}</span> : null}
      </div>
    </Link>
  )
}

function Chip({ href, label, active=false, ghost=false, disabled=false }:{ href:string, label:string, active?:boolean, ghost?:boolean, disabled?:boolean }){
  const cls = [s.chip, active? s.active:'', ghost? s.ghost:''].filter(Boolean).join(' ')
  return disabled ? <span className={cls} aria-disabled="true">{label}</span> : <Link className={cls} href={href}>{label}</Link>
}
