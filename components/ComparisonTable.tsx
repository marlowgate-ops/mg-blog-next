'use client'
import AffLink from '@/components/AffLink'
import Stars from '@/components/Stars'
import { AFF } from '@/lib/aff-config'

export default function ComparisonTable(){
  const rows = [
    { name:'DMM.com証券', score:88, account:'FX / CFD / 株', platform:'Web / アプリ', fee:'—', spread:'編集評価', link: AFF.DMM || 'https://securities.dmm.com/' },
    { name:'松井証券（準備中）', score:0, account:'—', platform:'—', fee:'—', spread:'—', link:'#' },
    { name:'GMOクリック証券（準備中）', score:0, account:'—', platform:'—', fee:'—', spread:'—', link:'#' },
  ]
  return (
    <div className="wrap">
      <div className="hdr">
        <h2>主要スペック比較</h2>
      </div>
      <div className="tblwrap">
        <table className="tbl" role="table">
          <thead>
            <tr>
              <th>業者</th>
              <th>編集スコア</th>
              <th>口座/商品</th>
              <th>プラットフォーム</th>
              <th>コスト</th>
              <th>備考</th>
              <th>口座開設</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td>{r.name}</td>
                <td><Stars score={r.score} /></td>
                <td>{r.account}</td>
                <td>{r.platform}</td>
                <td>{r.fee}</td>
                <td>{r.spread}</td>
                <td><AffLink href={r.link} gaLabel={`table-${r.name}`}>公式サイトで口座開設</AffLink></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .wrap{ margin-top:18px; }
        .hdr{ display:flex; align-items:center; justify-content:space-between; }
        .tblwrap{ overflow-x:auto; }
        .tbl{ width:100%; border-collapse:separate; border-spacing:0; min-width:760px; }
        th,td{ text-align:left; padding:10px 12px; border-bottom:1px solid #e5e7eb; }
        thead th{ position:sticky; top:64px; background:#fff; z-index:1; }
        tbody tr:hover{ background:#fafafa; }
      `}</style>
    </div>
  )
}
