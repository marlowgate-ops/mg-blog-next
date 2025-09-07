type Props = { page: number; totalPages: number; basePath: string }

export default function Pagination({ page, totalPages, basePath }: Props) {
  const prev = page > 1 ? `${basePath}/${page - 1}` : null
  const next = page < totalPages ? `${basePath}/${page + 1}` : null
  return (
    <nav style={{display:'flex', gap:12, marginTop:24}}>
      <a aria-disabled={!prev} href={prev ?? '#'} style={{opacity: prev ? 1 : 0.4, pointerEvents: prev ? 'auto' : 'none'}}>← Prev</a>
      <span style={{color:'#666'}}>Page {page} / {totalPages}</span>
      <a aria-disabled={!next} href={next ?? '#'} style={{opacity: next ? 1 : 0.4, pointerEvents: next ? 'auto' : 'none'}}>Next →</a>
    </nav>
  )
}
