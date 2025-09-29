
'use client'
import AffLink from "@/components/AffLink"
import { AFF } from "@/lib/aff-config"

export default function ReviewDMM() {
  return (
    <>
      <div className="cta">
        {AFF.DMM ? <AffLink href={AFF.DMM} gaLabel="DMM-review">公式サイトで開設手順を見る</AffLink> : <a href="https://securities.dmm.com/" className="ghost">公式サイト</a>}
      </div>
      <h2>良い点</h2>
      <ul>
        <li>取引ツールが分かりやすい</li>
        <li>約定スピード・サポートに定評</li>
        <li>国内大手の信頼感</li>
      </ul>
      <h2>注意点</h2>
      <ul>
        <li>キャンペーン条件は要確認</li>
      </ul>
      <style jsx>{`
        .cta { margin:12px 0 16px; }
        .ghost { display:inline-block; padding:10px 14px; border:1px solid #93c5fd; border-radius:10px; }
      `}</style>
    </>
  )
}
