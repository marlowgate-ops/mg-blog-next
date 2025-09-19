'use client'
import { campaigns } from '@/data/campaigns'
import { useMemo, useState } from 'react'
import Link from 'next/link'

export default function CampaignsTable(){
  const [sort, setSort] = useState<'max'|'until'>('max')
  const data = useMemo(()=>{
    return [...campaigns].sort((a,b)=> sort==='max' ? b.max-a.max : a.until.localeCompare(b.until))
  },[sort])
  return (
    <div>
      <div className="toolbar">
        <button onClick={()=>setSort('max')} className={sort==='max'?'on':''}>最大額</button>
        <button onClick={()=>setSort('until')} className={sort==='until'?'on':''}>締切</button>
      </div>
      <div className="tablewrap" role="region" aria-label="キャンペーン一覧">
        <table>
          <thead><tr><th>案件</th><th>最大額</th><th>条件</th><th>締切</th><th></th></tr></thead>
          <tbody>
            {data.map(row=> (
              <tr key={row.code}>
                <td>{row.name}</td>
                <td>¥{row.max.toLocaleString()}</td>
                <td className="cond">{row.condition}</td>
                <td><time dateTime={row.until}>{row.until}</time></td>
                <td><Link className="cta" href={row.url} target="_blank" rel="nofollow noopener">公式へ</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .toolbar{display:flex;gap:8px;margin-bottom:10px}
        .toolbar button{padding:6px 10px;border:1px solid #e5e7eb;border-radius:10px}
        .toolbar .on{border-color:#2563eb;background:#eff6ff}
        .tablewrap{overflow:auto;border:1px solid #e5e7eb;border-radius:12px}
        table{width:100%;border-collapse:separate;border-spacing:0;background:#fff}
        th,td{padding:10px 12px;border-bottom:1px solid #eef2f7;text-align:left;vertical-align:top}
        thead th{background:#f8fafc;font-weight:700}
        .cta{padding:6px 10px;border:1px solid #2563eb;border-radius:10px;white-space:nowrap}
        .cond{min-width:200px}
      `}</style>
    </div>
  )
}
