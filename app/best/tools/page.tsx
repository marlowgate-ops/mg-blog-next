import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList, itemListJSONLD } from "@/lib/seo/jsonld";
import Link from "next/link";

export const metadata = { title: "取引ツール・機能で選ぶ", description: "PCツールの拡張性やAPI対応など、機能面で選ぶ。" };

const bc = breadcrumbList({ { name: '比較', item: '/best' }, { name: '取引ツール', item: '/best/tools' } });
const il = itemListJSONLD("取引ツール・機能で選ぶ", {
  { name: "DMM FX", url: "/best/forex-brokers-jp#rank-1" },
  { name: "GMOクリック", url: "/best/forex-brokers-jp#rank-2" }
});

export default function Page() {
  return (
    <main style={padding:'16px'}>
      <JsonLd data={bc} />
      <JsonLd data={il} />
      <Breadcrumbs items={{name:'比較', href:'/best'}, {name:'取引ツール'}} />
      <div style={display:'flex',alignItems:'center',gap:8,margin:'6px 0 10px'}>
        <PrBadge /><AuthorMeta />
      </div>
      <h1 style={fontSize:22,margin:'0 0 8px'}>取引ツール・機能で選ぶ</h1>
      <p style={color:'#475569',margin:'0 0 12px'}>PCツールの拡張性やAPI対応など、機能面で選ぶ。</p>
      <section aria-labelledby="rank">
  <h2 id="rank" style={{fontSize:18,margin:'12px 0'}}>取引ツール・機能で選ぶ</h2>
  <p style={{color:'#334155'}}>PCツールの拡張性、<strong>API/自動売買</strong>、板情報、アラート等を比較。</p>
</section>
      <div style={marginTop:20}><Link href="/best/forex-brokers-jp">← 総合ランキングに戻る</Link></div>
    </main>
  );
}
