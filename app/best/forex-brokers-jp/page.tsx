
import BestDomestic from "@/components/BestDomestic"

export const metadata = {
  title: "【2025年版】国内向けおすすめFX・CFD業者ランキング｜Marlow Gate",
  description: "初心〜中級者に必要な安全性・約定・コスト・サポートを評価軸に、国内サービスを中心に厳選。まずはDMM.com証券から。"
}

export default function Page() {
  return (
    <main className="wrap">
      <p className="disclosure">※本ページには広告が含まれます。<a href="/disclaimer">免責</a></p>
      <h1>【2025年版】国内向けおすすめFX・CFD業者ランキング</h1>
      <p className="lead">結論：初心〜中級でまず実務が安定する、<strong>国内サービス</strong>を中心に選ぶ。評価軸は「スプレッド/手数料・約定・入出金・サポート」。</p>
      <BestDomestic />
      <p className="note">表示の順序やスコアは編集部判断です。料金や条件は変動します。最新は各公式をご確認ください。</p>
      <style jsx>{`
        .wrap { max-width: 1000px; margin: 0 auto; padding: 24px 16px 56px; }
        .disclosure { color:#6b7280; font-size:.85rem; margin:0 0 8px; }
        h1 { font-size:1.45rem; margin: 0 0 10px; }
        .lead { color:#374151; }
        .note { color:#6b7280; font-size:.85rem; margin-top:18px; }
      `}</style>
    </main>
  )
}
