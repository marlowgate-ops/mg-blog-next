import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import RankingList from "@/components/RankingList";
import { breadcrumbList, itemListJSONLD } from "@/lib/seo/jsonld";
import Link from "next/link";

export const metadata = { title: "口座開設キャンペーン一覧", description: "最大額/締切/条件で横断比較。" };

export default function Page() {
  const bc = breadcrumbList([
    { name: '比較', item: '/best' },
    { name: 'キャンペーン', item: '/best/campaigns' }
  ]);
  const il = itemListJSONLD("口座開設キャンペーン一覧", [
    { name: "DMM FX", url: "/best/forex-brokers-jp#rank-1" },
    { name: "GMOクリック", url: "/best/forex-brokers-jp#rank-2" }
  ]);

  return (
    <main style={{ padding: '16px' }}>
      <JsonLd data={bc} />
      <JsonLd data={il} />
      <Breadcrumbs items={[{name:'比較', href:'/best'}, {name:'キャンペーン'}]} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 10px' }}>
        <PrBadge /><AuthorMeta />
      </div>
      <h1 style={{ fontSize: 22, margin: '0 0 8px' }}>口座開設キャンペーン一覧</h1>
      <p style={{ color: '#475569', margin: '0 0 12px' }}>最大額/締切/条件で横断比較。</p>

      <section aria-labelledby="rank">
        <h2 id="rank" style={{fontSize:18,margin:'12px 0'}}>ランキング</h2>
        <RankingList mode="total" limit={10} />
      </section>

      <div style={{ marginTop: 20 }}>
        <Link href="/best/forex-brokers-jp">← 総合ランキングに戻る</Link>
      </div>
    </main>
  );
}
