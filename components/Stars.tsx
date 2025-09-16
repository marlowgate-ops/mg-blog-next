'use client'
export default function Stars({score}:{score:number}){
  const s = Math.max(0, Math.min(5, Math.round((score/20)*10)/10))
  const list=[0,1,2,3,4].map(i=> i+1 <= Math.floor(s) ? 'full' : (i < s ? 'half' : 'empty'))
  return (
    <div className="stars" aria-label={`評価 ${s} / 5`}>
      {list.map((t,i)=>(<span key={i} className={`s ${t}`} />))}
      <span className="num">{s.toFixed(1)}</span>
      <style jsx>{`
        .stars {display:inline-flex; align-items:center; gap:4px; color:#f59e0b;}
        .s{width:14px; height:14px; display:inline-block; background:conic-gradient(#f59e0b 0 0); mask:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 17.3-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03z"/></svg>') center/contain no-repeat; background:#e5e7eb;}
        .s.full{ background:#f59e0b; }
        .s.half{ background: linear-gradient(90deg,#f59e0b 50%, #e5e7eb 50%); }
        .num{ font-size:.85rem; color:#6b7280; margin-left:2px; }
      `}</style>
    </div>
  )
}
