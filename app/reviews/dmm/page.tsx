'use client'

import AffLink from "@/components/AffLink"
import { AFF } from "@/lib/aff-config"

export const metadata = {
  title: "DMM.com証券の評価と口座開設ガイド｜Marlow Gate",
  description: "DMM.com証券の特徴、良い点/注意点、口座開設までの流れを簡潔に。"
}

export default function Page() {
  return (
    <main className="wrap">
      <h1>DMM.com証券の評価と口座開設ガイド</h1>
      <p>初心者でも扱いやすいUIとサポート体制、国内大手としての安心感が特徴です。スプレッド・約定・入出金などの運用条件は時期により変わるため、最新情報は公式で確認してください。</p>
      <div className="cta">
        {AFF.DMM ? <AffLink href={AFF.DMM} label="公式サイトで開設手順を見る" gaLabel="DMM-review" /> : <a href="https://securities.dmm.com/" className="ghost">公式サイト</a>}
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
        .wrap { max-width: 860px; margin:0 auto; padding:24px 16px 56px; }
        h1 { font-size:1.4rem; margin:0 0 8px; }
        .cta { margin:12px 0 16px; }
        .ghost { display:inline-block; padding:10px 14px; border:1px solid #93c5fd; border-radius:10px; }
      `}</style>
    </main>
  )
}
