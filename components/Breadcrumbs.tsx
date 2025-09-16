'use client'
import Link from 'next/link'

export default function Breadcrumbs({items}:{items:{name:string, href?:string}[]}){
  return (
    <nav className="bc" aria-label="パンくずリスト">
      {items.map((it,idx)=>(
        <span key={idx} className="item">
          {it.href ? <Link href={it.href}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
          {idx < items.length-1 && <span className="sep">›</span>}
        </span>
      ))}
      <style jsx>{`
        .bc { font-size:.9rem; color:#6b7280; display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
        .item :global(a){ color:#6b7280; }
        .item :global(a:hover){ color:#111827; text-decoration:underline; }
        .sep{ margin:0 2px; }
      `}</style>
    </nav>
  )
}
