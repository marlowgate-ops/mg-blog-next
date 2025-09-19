import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList, itemListJSONLD } from "@/lib/seo/jsonld";
import Link from "next/link";

export const metadata = {{ title: "低スプレッドで選ぶ（コスト重視）", description: "スプレッド/手数料を重視した口座選び。相場急変時の広がりも含めて総コストで比較。" }};

export default function Page() {{
  const bc = breadcrumbList([{ name: '比較', item: '/best' }, { name: '低スプレッド', item: '/best/low-spread' }]);
  const il = itemListJSONLD("低スプレッドで選ぶ（コスト重視）", [{ name:'DMM.com証券', url:'/best/forex-brokers-jp#rank-1' },{ name:'松井証券（準備中）', url:'/best/forex-brokers-jp#rank-2' },{ name:'ゴールデンウェイ・ジャパン（FXTF）', url:'/best/forex-brokers-jp#rank-3' }]);
  return (
    <main style={{{padding:'16px'}}}>
      <JsonLd data={{bc}}/><JsonLd data={{il}}/>
      <Breadcrumbs items={[{name:'比較', href:'/best'}, {name:'低スプレッド'}]} />
      <div style={{{display:'flex',alignItems:'center',gap:8,margin:'6px 0 10px'}}}>
        <PrBadge/><AuthorMeta/>
      </div>
      <h1 style={{{fontSize:22,margin:'0 0 8px'}}}>低スプレッドで選ぶ（コスト重視）</h1>
      <p style={{{color:'#475569',margin:'0 0 12px'}}}>スプレッド/手数料を重視した口座選び。相場急変時の広がりも含めて総コストで比較。</p>
      <section aria-labelledby="rank"><h2 id="rank" style={{fontSize:18,margin:'12px 0'}}>低スプレッドで選ぶ</h2><p style={{color:'#334155'}}>スプレッドが狭いだけでなく、<strong>相場急変時の広がり</strong>や約定の安定性も総コストに影響します。短期売買ほど「提示の細さ＋約定の安定」の両立が重要です。</p></section>
      <div style={{{marginTop:20}}}><Link href="/best/forex-brokers-jp">← 総合ランキングに戻る</Link></div>
    </main>
  );
}}
