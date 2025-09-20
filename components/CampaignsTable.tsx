'use client'
import { useMemo, useState } from 'react'
import { campaigns as base } from '@/data/campaigns'

type SortKey = 'amount' | 'deadline' | 'brand'

function formatYen(n: number) {
  return '¥' + (n || 0).toLocaleString()
}
function formatDate(iso?: string | null) {
  if (!iso) return '未定'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '未定'
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${yyyy}/${mm}/${dd}`
}

export default function CampaignsTable() {
  const [onlyActive, setOnlyActive] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('amount')
  const [asc, setAsc] = useState(false)

  const data = useMemo(() => {
    let arr = [...base]
    if (onlyActive) arr = arr.filter(x => x.active)
    arr.sort((a,b)=>{
      if (sortKey === 'amount') return (asc ? 1 : -1) * ((a.maxAmountYen ?? 0) - (b.maxAmountYen ?? 0))
      if (sortKey === 'deadline') {
        const da = a.deadline ? +new Date(a.deadline) : Number.MAX_SAFE_INTEGER
        const db = b.deadline ? +new Date(b.deadline) : Number.MAX_SAFE_INTEGER
        return (asc ? 1 : -1) * (da - db)
      }
      return (asc ? 1 : -1) * a.brand.localeCompare(b.brand, 'ja')
    })
    return arr
  }, [onlyActive, sortKey, asc])

  return (
    <div className="cmp">
      <div className="toolbar">
        <label><input type="checkbox" checked={onlyActive} onChange={(e)=>setOnlyActive(e.target.checked)} /> 受付中のみ</label>
        <div className="sorts">
          <button className={sortKey==='amount'?'on':''} onClick={()=> sortKey==='amount' ? setAsc(!asc) : (setSortKey('amount'), setAsc(false))}>最大額</button>
          <button className={sortKey==='deadline'?'on':''} onClick={()=> sortKey==='deadline' ? setAsc(!asc) : (setSortKey('deadline'), setAsc(true))}>締切</button>
          <button className={sortKey==='brand'?'on':''} onClick={()=> sortKey==='brand' ? setAsc(!asc) : (setSortKey('brand'), setAsc(true))}>会社</button>
        </div>
      </div>

      <div className="wrap" role="region" aria-label="口座開設キャンペーン一覧">
        <table>
          <thead>
            <tr>
              <th>会社</th>
              <th>最大額</th>
              <th>条件</th>
              <th>締切</th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id}>
                <td>{c.brand}{!c.active && <span className="ended">（終了）</span>}</td>
                <td className="num">{formatYen(c.maxAmountYen)}</td>
                <td>{c.condition}{c.notes && <div className="notes">{c.notes}</div>}</td>
                <td>{formatDate(c.deadline ?? undefined)}</td>
                <td><a className="cta" href={c.url}>公式へ</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="note">※ 条件・金額・締切は必ず公式サイトでご確認ください。</div>
      </div>

      <style jsx>{`
        .toolbar{display:flex;justify-content:space-between;gap:12px;margin:8px 0 12px}
        .sorts{display:flex;gap:6px}
        .sorts button{border:1px solid #e5e7eb;border-radius:8px;background:#fff;padding:6px 10px;cursor:pointer}
        .sorts button.on{background:#f1f5f9}
        .wrap{overflow:auto;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
        table{width:100%;border-collapse:separate;border-spacing:0}
        th,td{padding:10px 12px;border-bottom:1px solid #eef2f7;text-align:left;vertical-align:top;white-space:nowrap}
        thead th{background:#f8fafc;font-weight:700}
        td.num{text-align:right}
        .notes{color:#64748b;font-size:12px}
        .ended{color:#9ca3af;font-size:12px}
        .note{color:#64748b;font-size:12px;margin:8px}
        .cta{display:inline-block;border:1px solid #06b6d4;border-radius:8px;padding:6px 10px;text-decoration:none}
      `}</style>
    </div>
  )
}
