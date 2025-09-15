
'use client'
import AffLink from "@/components/AffLink"
import { AFF } from "@/lib/aff-config"

function Card({ title, score, pros, cons, cta }: {
  title: string; score: number; pros: string[]; cons: string[]; cta?: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="header">
        <h3>{title}</h3>
        <div className="score"><strong>{score}</strong>/100</div>
      </div>
      <div className="cols">
        <div>
          <div className="label">良い点</div>
          <ul>{pros.map((p,i)=>(<li key={i}>{p}</li>))}</ul>
        </div>
        <div>
          <div className="label warn">注意点</div>
          <ul>{cons.map((p,i)=>(<li key={i}>{p}</li>))}</ul>
        </div>
      </div>
      <div className="cta">{cta}</div>
      <style jsx>{`
        .card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:20px; box-shadow:0 1px 2px rgba(0,0,0,.04); }
        .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        h3 { font-size:1.1rem; margin:0; }
        .score strong { font-size:1.15rem;}
        .cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:8px; }
        .label { font-size:.85rem; color:#111827; font-weight:600; margin:6px 0; }
        .label.warn { color:#b45309; }
        ul { margin:0; padding-left:1em; }
        li { margin:4px 0; }
        .cta { margin-top:14px; }
        @media (max-width: 720px) { .cols { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

export default function BestDomestic() {
  return (
    <>
      <section className="grid">
        <Card
          title="DMM.com証券"
          score={88}
          pros={["国内大手の信頼感","約定スピードに定評","初心者向けUI"]}
          cons={["キャンペーン期は条件要確認"]}
          cta={AFF.DMM ? (
            <AffLink href={AFF.DMM} label="公式サイトで口座開設情報とレビュー" gaLabel="DMM" />
          ) : (
            <a href="https://securities.dmm.com/" className="ghost">公式サイト</a>
          )}
        />
        <Card title="松井証券（準備中）" score={0} pros={["準備中"]} cons={["準備中"]} />
        <Card title="GMOクリック証券（準備中）" score={0} pros={["準備中"]} cons={["準備中"]} />
      </section>
      <style jsx>{`
        .grid { display:grid; grid-template-columns:1fr; gap:16px; margin-top:16px; }
        .ghost { display:inline-block; padding:10px 14px; border:1px solid #93c5fd; border-radius:10px; }
        @media (min-width: 860px) { .grid { grid-template-columns:1fr 1fr 1fr; } }
      `}</style>
    </>
  )
}
