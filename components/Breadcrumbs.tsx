import Link from 'next/link'

export default function Breadcrumbs({ items }: { items: { name: string, href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 mb-6">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {it.href ? <Link className="underline" href={it.href}>{it.name}</Link> : <span>{it.name}</span>}
            {idx < items.length - 1 && <span>›</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
