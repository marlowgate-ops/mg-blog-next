'use client'
import Stars from '@/components/Stars'
import AffLink from '@/components/AffLink'
export default function ComparisonTable(){
  const DMM = process.env.NEXT_PUBLIC_AFF_DMM || ''
  const FXTF = process.env.NEXT_PUBLIC_AFF_FXTF || ''
  const rows = [
    {name:'DMM.com証券', score:88, account:'FX / CFD / 株', platform:'Web / アプリ', cost:'編集評価', note:'—', link:DMM},
    {name:'ゴールデンウェイ・ジャパン（FXTF）', score:0, account:'FX', platform:'Web / アプリ', cost:'—', note:'—', link:FXTF},
    {name:'松井証券（準備中）', score:0, account:'—', platform:'—', cost:'—', note:'—', link:'#'},
    {name:'GMOクリック証券（準備中）', score:0, account:'—', platform:'—', cost:'—', note:'—', link:'#'},
  ]
  return (
    <div style={{overflow:'auto'}}>
      <table style={{minWidth:900,width:'100%'}} role="table">
        <thead>
          <tr>
            <th>業者</th><th>編集スコア</th><th>口座/商品</th><th>プラットフォーム</th><th>コスト</th><th>備考</th><th>口座開設</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.name}</td>
              <td><Stars score={r.score}/></td>
              <td>{r.account}</td>
              <td>{r.platform}</td>
              <td>{r.cost}</td>
              <td>{r.note}</td>
              <td>{r.link ? <AffLink href={r.link} gaLabel={`table-${r.name}`}>公式サイトで口座開設</AffLink> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
