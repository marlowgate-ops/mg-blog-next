
'use client'

export default function PRRibbon() {
  return (
    <div className="pr" aria-label="PR disclosure">
      PR
      <span className="tip">当ページには広告（アフィリエイト）が含まれます。掲載順位や推奨は編集基準に基づき、広告の有無のみで決定されません。</span>
      <style jsx>{`
        .pr { position:fixed; top:54px; right:12px; z-index:50;
              font-size:12px; line-height:1; padding:5px 7px; border-radius:9999px;
              background:#fef3c7; color:#92400e; border:1px solid #f59e0b; cursor:help; }
        .tip { visibility:hidden; opacity:0; transition:opacity .15s; position:absolute; right:0; top:140%;
               background:#111827; color:#fff; padding:8px 10px; border-radius:8px; width:280px; }
        .pr:hover .tip { visibility:visible; opacity:1; }
        @media (max-width:640px){ .pr{ top:50px; right:8px; } .tip{ width:240px; } }
      `}</style>
    </div>
  )
}
