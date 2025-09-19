'use client'
import { popularThisMonth } from '@/data/popular'
import Link from 'next/link'

export default function PopularRanking(){
  return (
    <ol className="pop-list">
      {popularThisMonth.map(item=> (
        <li key={item.rank} className="pop-item">
          <div className="rank">#{item.rank}</div>
          <div className="name">{item.name}</div>
          <div className="reason">{item.reason}</div>
          <Link className="cta" href={item.url} target="_blank" rel="nofollow noopener">{item.cta}</Link>
        </li>
      ))}
      <style jsx>{`
        .pop-list{display:grid;gap:12px}
        .pop-item{display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;
          border:1px solid #e5e7eb;border-radius:12px;padding:12px;background:#fff}
        .rank{font-weight:800;color:#2563eb}
        .name{font-weight:700}
        .reason{color:#475569}
        .cta{padding:8px 12px;border:1px solid #2563eb;border-radius:10px}
        @media(max-width:640px){ .pop-item{grid-template-columns:44px 1fr} .cta{grid-column:1/-1} }
      `}</style>
    </ol>
  )
}
