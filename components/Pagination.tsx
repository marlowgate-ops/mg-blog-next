// components/Pagination.tsx
import Link from 'next/link'

export default function Pagination({
  current,
  pages,
  basePath,
}: { current: number; pages: number; basePath: string }) {
  if (pages <= 1) return null
  const prev = current > 1 ? current - 1 : null
  const next = current < pages ? current + 1 : null

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: 12 }}>
      {prev ? <Link href={`${basePath}/${prev}`}>← Prev</Link> : <span />}
      <span>Page {current} / {pages}</span>
      {next ? <Link href={`${basePath}/${next}`}>Next →</Link> : <span />}
    </nav>
  )
}
