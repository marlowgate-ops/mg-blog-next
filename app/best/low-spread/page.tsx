import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import RankingList from "@/components/RankingList";
import { breadcrumbList, itemListJSONLD } from "@/lib/seo/jsonld";
import Link from "next/link";

export const metadata = { title: "低スプレッドで選ぶ（コスト重視）", description: "スプレッド/手数料を重視した口座選び。相場急変時の広がりも含めて総コストで比較。" };

export default function Page() {
  const bc = breadcrumbList({
    { name: '比較', item: '/best' },
    { name: '低スプレッド', item: '/best/low-spread' }
  });
  const il = itemListJSONLD("低スプレッドで選ぶ（コスト重視）", [
    { name: "DMM FX", url: "/best/forex-brokers-jp#rank-1" },
    { name: "GMOクリック", url: "/best/forex-brokers-jp#rank-2" }
  ]);

  return (
    <main style={ padding: '16px' }>
      <JsonLd data={bc} />
      <JsonLd data={il} />
      <Breadcrumbs items={ {name:'比較', href:'/best'}, {name:'低スプレッドで選ぶ（コスト重視）'} } />
      <div style={ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 10px' }>
        <PrBadge /><AuthorMeta />
      </div>
      <h1 style={ fontSize: 22, margin: '0 0 8px' }]>低スプレッドで選ぶ（コスト重視）</h1>
      <p style={ color: '#475569', margin: '0 0 12px' }]>スプレッド/手数料を重視した口座選び。相場急変時の広がりも含めて総コストで比較。</p>

      <section aria-labelledby="rank">
        <h2 id="rank" style={fontSize:18,margin:'12px 0'}>ランキング</h2>
        <RankingList mode="cost" limit={10} />
      </section>

      <div style={ marginTop: 20 }><Link href="/best/forex-brokers-jp">← 総合ランキングに戻る</Link></div>
    </main>
  );
}
