import Link from 'next/link'

type Item = { title: string; url: string; date: string; description?: string }

export default function RelatedPosts({ items }: { items: Item[] }) {
  if (!items?.length) return null
  return (
    <section style={{marginTop:'36px'}}>
      <h2 className="h2">Related posts</h2>
      <ul className="grid">
        {items.map((p) => (
          <li key={p.url}>
            <Link href={p.url} className="card" style={{display:'block'}}>
              <h3 style={{fontWeight:600, fontSize:'1.05rem'}}>{p.title}</h3>
              {p.description ? (
                <p className="muted" style={{marginTop:'6px'}}>{p.description}</p>
              ) : null}
              <div className="small muted" style={{marginTop:'8px'}}>{new Date(p.date).toISOString().slice(0,10)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
