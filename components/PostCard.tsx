import Link from 'next/link'

export function PostCard(props: { href: string, title: string, description?: string, date?: string, tags?: string[] }) {
  return (
    <Link href={props.href} style={{ display:'block', padding:16, border:'1px solid #eee', borderRadius:12, textDecoration:'none', color:'#111' }}>
      <div style={{ fontWeight:600, marginBottom:6 }}>{props.title}</div>
      {props.description && <div style={{ color:'#555', fontSize:14, marginBottom:8 }}>{props.description}</div>}
      <div style={{ display:'flex', gap:8, alignItems:'center', color:'#888', fontSize:12 }}>
        {props.date && <time>{new Date(props.date).toLocaleDateString('ja-JP')}</time>}
        {props.tags && props.tags.length>0 && (
          <span>· {props.tags.map((t,i)=>(<span key={t}>{i>0?', ':''}#{t}</span>))}</span>
        )}
      </div>
    </Link>
  )
}
