'use client'
import { reviews } from '@/data/reviews'

export default function Reviews(){
  const avg = (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)
  return (
    <section>
      <div className="head">
        <div className="score"><span className="big">{avg}</span>/5</div>
        <div className="meta">編集部監修・モデレート済みの口コミ（抜粋）。体験談は個人の感想であり、将来の成果を保証するものではありません。</div>
      </div>
      <ul className="list">
        {reviews.slice(0,3).map((r,i)=> (
          <li key={i} className="item">
            <div className="rating">★ {r.rating.toFixed(1)}</div>
            <div className="title">{r.title}</div>
            <div className="body">{r.body}</div>
            <time className="date" dateTime={r.date}>{r.date}</time>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .head{display:flex;gap:12px;align-items:center;margin-bottom:10px}
        .score{font-weight:700}.big{font-size:28px;margin-right:4px}
        .meta{color:#64748b}
        .list{display:grid;gap:10px}
        .item{border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px}
        .rating{font-weight:700}
        .title{font-weight:700;margin-top:2px}
        .body{color:#334155;margin-top:4px}
        .date{color:#64748b;font-size:12px}
      `}</style>
    </section>
  )
}
