import { scoring, weights } from '@/data/scoring'

export default function ScoreBreakdown(){
  return (
    <div className="scores">
      <div className="meta">配点: 約定{Math.round(weights.execution*100)}%、アプリ{Math.round(weights.app*100)}%、コスト{Math.round(weights.cost*100)}%、サポート{Math.round(weights.support*100)}%</div>
      <div className="grid">
        {scoring.map(s => (
          <div key={s.code} className="card">
            <div className="name">{s.name}<span className="total">{s.total}/100</span></div>
            <dl>
              <div><dt>約定</dt><dd>{s.by.execution}</dd></div>
              <div><dt>アプリ</dt><dd>{s.by.app}</dd></div>
              <div><dt>コスト</dt><dd>{s.by.cost}</dd></div>
              <div><dt>サポート</dt><dd>{s.by.support}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <style jsx>{`
        .meta{color:#475569;margin-bottom:10px}
        .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .card{border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px}
        .name{display:flex;justify-content:space-between;font-weight:700}
        dl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}
        dt{color:#64748b} dd{font-weight:700}
        @media(max-width:900px){ .grid{grid-template-columns:1fr} dl{grid-template-columns:repeat(2,1fr)} }
      `}</style>
    </div>
  )
}
