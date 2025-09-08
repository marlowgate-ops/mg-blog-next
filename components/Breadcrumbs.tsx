import Link from 'next/link'

type Crumb = { name: string; href?: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null

  return (
    <nav aria-label="パンくず" className="mb-6">
      <ol className="flex items-center gap-1 text-sm text-neutral-600 overflow-x-auto no-scrollbar whitespace-nowrap">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center">
              {it.href && !isLast ? (
                <Link
                  href={it.href}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors max-w-[40vw] md:max-w-none"
                >
                  <span className="truncate">{it.name}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 max-w-[60vw] md:max-w-none truncate"
                >
                  {it.name}
                </span>
              )}

              {!isLast && (
                <span className="mx-1 text-neutral-400" aria-hidden="true">
                  {/* inline chevron icon (no extra deps) */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  )
}
