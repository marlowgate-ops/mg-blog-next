import Image from 'next/image'

export default function AuthorBio(){
  return (
    <aside className="bio">
      <Image src="/authors/marlow-gate.png" alt="Marlow Gate 編集部" width={44} height={44} className="avatar" />
      <div className="txt">
        <div className="name">Marlow Gate 編集部</div>
        <p>投資サービスの比較検証を専門とする編集チーム。実取引・ヒアリング・ドキュメントレビューを通じて、初心者にも分かりやすい基準で評価します。</p>
      </div>
      <style jsx>{`
        .bio{display:flex;gap:12px;align-items:flex-start;border:1px solid #e5e7eb;border-radius:12px;background:#fff;padding:12px}
        .name{font-weight:700;margin-bottom:2px}
        .txt p{color:#334155}
      `}</style>
    </aside>
  )
}
