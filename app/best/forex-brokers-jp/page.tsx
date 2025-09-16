
import BestDomestic from "@/components/BestDomestic"
import PRRibbon from "@/components/PRRibbon"
import Breadcrumbs from "@/components/Breadcrumbs"
import ComparisonTable from "@/components/ComparisonTable"
import FAQ from "@/components/FAQ"

export const metadata = {
  title: "【2025年版】国内向けおすすめFX・CFD業者ランキング｜Marlow Gate",
  description: "初心〜中級者に必要な安全性・約定・コスト・サポートを評価軸に、国内サービスを中心に厳選。DMM.com証券ほかを比較。"
}

function jsonLd(){
  const itemList = [{ name:"DMM.com証券", url:"https://securities.dmm.com/", position:1, ratingValue:4.4, bestRating:5 },
                    { name:"松井証券", url:"https://www.matsui.co.jp/", position:2 },
                    { name:"GMOクリック証券", url:"https://www.click-sec.com/", position:3 }]
  const ld = [
    {
      "@context":"https://schema.org",
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"ホーム","item":"https://blog.marlowgate.com/"},
        {"@type":"ListItem","position":2,"name":"比較","item":"https://blog.marlowgate.com/best/"},
        {"@type":"ListItem","position":3,"name":"国内向けFX・CFD"}
      ]
    },
    {
      "@context":"https://schema.org",
      "@type":"ItemList",
      "itemListElement": itemList.map((it,idx)=>({"@type":"ListItem","position":idx+1,"url":it.url,"name":it.name}))
    },
    {
      "@context":"https://schema.org",
      "@type":"Review",
      "itemReviewed": {"@type":"Organization","name":"DMM.com証券"},
      "reviewRating": {"@type":"Rating","ratingValue":"4.4","bestRating":"5"},
      "author": {"@type":"Organization","name":"Marlow Gate"}
    }
  ]
  return JSON.stringify(ld)
}

export default function Page() {
  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      <PRRibbon />
      <Breadcrumbs items={[{name:"ホーム",href:"/"},{name:"比較",href:"/best/"},{name:"国内向けFX・CFD"}]} />
      <p className="disclosure">※本ページには広告が含まれます。<a href="/disclaimer">免責</a></p>
      <h1>【2025年版】国内向けおすすめFX・CFD業者ランキング</h1>
      <p className="lead">結論：初心〜中級でまず実務が安定する、<strong>国内サービス</strong>を中心に選ぶ。評価軸は「スプレッド/手数料・約定・入出金・サポート」。</p>
      <BestDomestic />
      <ComparisonTable />
      <FAQ />
      <p className="note">表示の順序やスコアは編集部判断です。料金や条件は変動します。最新は各公式をご確認ください。</p>
    </main>
  )
}
