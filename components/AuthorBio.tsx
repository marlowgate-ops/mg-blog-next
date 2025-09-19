import Image from 'next/image'
export default function AuthorBio(){
  return (
    <aside style={{display:'flex',gap:12,alignItems:'flex-start',border:'1px solid #e5e7eb',borderRadius:12,background:'#fff',padding:12}}>
      <Image src="/authors/marlow-gate.png" alt="Marlow Gate 編集部" width={44} height={44} />
      <div>
        <div style={{fontWeight:700,marginBottom:2}}>Marlow Gate 編集部</div>
        <p style={{color:'#334155'}}>投資サービスの比較検証を専門とする編集チーム。実取引・ヒアリング・ドキュメントレビューで初心者にも分かりやすい基準を採用。</p>
      </div>
    </aside>
  )
}
