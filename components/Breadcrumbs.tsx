'use client'
import Link from 'next/link'
type Crumb = { name: string, href?: string }
export default function Breadcrumbs({items}:{items:Crumb[]}){
  return (
    <nav aria-label="breadcrumb" className="bc">
      <ol>
        {items.map((it,i)=>{
          const isLast = i===items.length-1
          return (
            <li key={i}>
              {it.href && !isLast ? <Link href={it.href}>{it.name}</Link> : <span aria-current={isLast?'page':undefined}>{it.name}</span>}
              {!isLast ? <span className="sep">›</span> : null}
            </li>
          )
        })}
      </ol>
      <style jsx>{`
        .bc{font-size:12px;color:#6b7280;margin:4px 0 8px 0}
        ol{display:flex;gap:6px;list-style:none;padding:0;margin:0}
        a{color:#6b7280}
        .sep{padding:0 2px}
      `}</style>
    </nav>
  )
}
