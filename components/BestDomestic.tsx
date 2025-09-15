
'use client'
import AffLink from "@/components/AffLink"
import { AFF } from "@/lib/aff-config"

function Card({ title, score, pros, cons, href }: {
  title: string; score: number; pros: string[]; cons: string[]; href: string
}) {
  const link = href || "https://securities.dmm.com/"
  return (
    <div className="card">
      <div className="top">
        <h3>{title}</h3>
        <div className="meta"><span className="score"><strong>{score}</strong>/100</span></div>
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
      <div className="cta">
        <AffLink href={link} gaLabel={`cta-${title}`}>公式サイトで口座開設</AffLink>
      </div>
      <style jsx>{`
        .card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:18px; box-shadow:0 1px 2px rgba(0,0,0,.04); position:relative; }
        .top { display:flex; justify-content:space-between; align-items:center; gap:12px; }
        h3 { font-size:1.05rem; margin:0; }
        .meta { display:flex; align-items:center; gap:8px; }
        .score strong { font-size:1.05rem; }
        .cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:8px; }
        .label { font-size:.85rem; color:#111827; font-weight:600; margin:6px 0; }
        .label.warn { color:#b45309; }
        ul { margin:0; padding-left:1em; }
        li { margin:4px 0; }
        .cta { margin-top:14px; }
        .cta :global(a) { display:inline-block; padding:10px 14px; border-radius:10px; border:1px solid #93c5fd; }
        .cta :global(a:hover) { background:#eff6ff; }
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
          href={AFF.DMM || "https://securities.dmm.com/"}
        />
        <Card title="松井証券（準備中）" score={0} pros={["準備中"]} cons={["準備中"]} href={"#"} />
        <Card title="GMOクリック証券（準備中）" score={0} pros={["準備中"]} cons={["準備中"]} href={"#"} />
      </section>
      <style jsx>{`
        .grid { display:grid; grid-template-columns:1fr; gap:16px; margin-top:16px; }
        @media (min-width: 860px) { .grid { grid-template-columns:1fr 1fr 1fr; } }
      `}</style>
    </>
  )
}
