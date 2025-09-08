import Link from 'next/link'
import { site } from '@/lib/site'

export function Pagination({ current, total }:{ current:number, total:number }){
  const to = (n:number) => n===1 ? '/blog' : `/blog/page/${n}`
  return (
    <nav aria-label="Pagination" style={{ display:'flex', gap:8, justifyContent:'center', margin:'24px 0' }}>
      <Link aria-disabled={current===1} href={current>1 ? to(current-1) : '#'} style={{ padding:'8px 12px', border:'1px solid #eee', borderRadius:10, color:'#111', opacity: current===1 ? .4: 1 }}>Prev</Link>
      {Array.from({length: total}, (_,i)=>i+1).map(n => (
        <Link key={n} aria-current={n===current ? 'page' : undefined} href={to(n)} style={{ padding:'8px 12px', border:'1px solid #eee', borderRadius:10, color: n===current ? '#fff':'#111', background: n===current ? '#111':'#fff' }}>{n}</Link>
      ))}
      <Link aria-disabled={current===total} href={current<total ? to(current+1) : '#'} style={{ padding:'8px 12px', border:'1px solid #eee', borderRadius:10, color:'#111', opacity: current===total ? .4: 1 }}>Next</Link>
    </nav>
  )
}
