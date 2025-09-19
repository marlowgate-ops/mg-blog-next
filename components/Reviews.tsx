'use client'
import { reviews } from '@/data/reviews'
export default function Reviews(){
  const avg = (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)
  return (
    <div>
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:10}}>
        <div style={{fontWeight:700}}><span style={{fontSize:28,marginRight:4}}>{avg}</span>/5</div>
        <div style={{color:'#64748b'}}>編集部モデレート済の口コミ（抜粋）。個人の感想であり将来の成果を保証しません。</div>
      </div>
      <ul style={{display:'grid',gap:10}}>
        {reviews.slice(0,3).map((r,i)=>(
          <li key={i} style={{border:'1px solid #e5e7eb',borderRadius:12,background:'#fff',padding:12}}>
            <div style={{fontWeight:700}}>★ {r.rating.toFixed(1)} — {r.title}</div>
            <div style={{color:'#334155',marginTop:4}}>{r.body}</div>
            <time style={{color:'#64748b',fontSize:12}} dateTime={r.date}>{r.date}</time>
          </li>
        ))}
      </ul>
    </div>
  )
}
