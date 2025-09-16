'use client'
import { useState } from 'react'

const QA = [
  { q:'初心者は何から見れば良いですか？', a:'まずは国内サービスの口座（例：DMM.com証券）を1社用意し、少額でUIと入出金の動作を確認してから比較検討するのが安全です。' },
  { q:'ランキングの基準は？', a:'編集部の実務観点（安定性 / 約定 / コスト / 出入金 / サポート）を総合し、広告の有無のみでは決まりません。' },
  { q:'海外業者は扱いますか？', a:'現在は国内中心です。海外業者の比較は、審査/安全面の要件が整い次第、別ページで段階的に公開します。' },
]

export default function FAQ(){
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="faq">
      <h2>よくある質問</h2>
      <ul>
        {QA.map((item,idx)=>(
          <li key={idx} className={`it ${open===idx?'on':''}`}>
            <button className="q" onClick={()=> setOpen(open===idx?null:idx)} aria-expanded={open===idx}>
              {item.q}
            </button>
            <div className="a">{item.a}</div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .faq{ margin-top:24px; }
        ul{ list-style:none; padding:0; margin:0; display:grid; gap:8px; }
        .q{ width:100%; text-align:left; padding:12px 14px; border:1px solid #e5e7eb; border-radius:10px; background:#fff; }
        .a{ display:none; padding:10px 14px; color:#374151; }
        .it.on .a{ display:block; }
      `}</style>
    </section>
  )
}
