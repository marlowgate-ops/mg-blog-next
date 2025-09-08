import Link from 'next/link'

type Crumb = { name: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null
  return (
    <nav aria-label="パンくず" className="breadcrumbs">
      <ol>
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} style={{display:'flex', alignItems:'center'}}>
              {it.href && !isLast ? (
                <Link href={it.href} className="crumb-link"><span>{it.name}</span></Link>
              ) : (
                <span className="crumb-current" aria-current={isLast ? 'page' : undefined}>{it.name}</span>
              )}
              {!isLast && (
                <span className="sep" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
