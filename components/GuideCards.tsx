export default function GuideCards(){
  const items = [
    { title:'低スプレッドを選ぶ前に', body:'約定滑りや配信安定性も総コストに影響。相場急変時の広がりも確認。' },
    { title:'アプリ体験', body:'ワンタップ発注、足種切り替え、描画の滑らかさなどは短期で差になる。' },
    { title:'ツールとサポート', body:'PCツールの拡張性、APIや自動売買可否、サポート対応時間も評価。' },
  ]
  return (
    <div className="g">
      {items.map((it,i)=>(
        <article key={i} className="c">
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </article>
      ))}
      <style jsx>{`
        .g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .c{border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px}
        h3{font-weight:700;margin-bottom:6px}
        @media(max-width:900px){ .g{grid-template-columns:1fr} }
      `}</style>
    </div>
  )
}
