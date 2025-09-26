import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import RankingList from "@/components/RankingList";
import CampaignsTable from "@/components/CampaignsTable";
import LocalNavRail from "@/components/LocalNavRail";
import Container from "@/components/Container";
import BottomRecirculation from "@/components/BottomRecirculation";
import { breadcrumbList, itemListJSONLD } from "@/lib/seo/jsonld";
import Link from "next/link";
import s from "@/app/best/layout.module.css";

export const metadata = {
  title: "口座開設キャンペーン一覧",
  description: "最大額/締切/条件で横断比較。",
};

export default function Page() {
  const bc = breadcrumbList([
    { name: "比較", item: "/best" },
    { name: "キャンペーン", item: "/best/campaigns" },
  ]);
  const il = itemListJSONLD("口座開設キャンペーン一覧", [
    { name: "DMM FX", url: "/best/forex-brokers-jp#rank-1" },
    { name: "GMOクリック", url: "/best/forex-brokers-jp#rank-2" },
  ]);

  return (
    <>
      <JsonLd data={bc} />
      <JsonLd data={il} />
      <div className={s.page}>
        <Container>
          <div className={s.grid}>
            <main>
              <section id="ranking" data-section>
                <Breadcrumbs
                  items={[{ name: "比較", href: "/best" }, { name: "キャンペーン" }]}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: "6px 0 10px",
                  }}
                >
                  <PrBadge />
                  <AuthorMeta />
                </div>

                <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>
                  口座開設キャンペーン一覧
                </h1>
                <p style={{ color: "#475569", margin: "0 0 12px" }}>
                  最大額/締切/条件で横断比較。
                </p>

                <div className="section-card">
                  <h2 style={{ fontSize: 18, margin: "12px 0" }}>
                    関連ランキング
                  </h2>
                  <RankingList mode="total" limit={10} />
                </div>
              </section>

              <section id="compare" data-section style={{ marginTop: 24 }}>
                <div className="section-card">
                  <h2 style={{ fontSize: 18, margin: "12px 0" }}>
                    キャンペーン一覧
                  </h2>
                  <CampaignsTable />
                </div>

                <div style={{ marginTop: 20 }}>
                  <Link href="/best/forex-brokers-jp">← 総合ランキングに戻る</Link>
                </div>

                <BottomRecirculation
                  title="関連ページ"
                  links={[
                    { href: "/best/forex-brokers-jp", label: "総合ランキング", description: "使いやすさ重視の総合評価" },
                    { href: "/best/low-spread", label: "低スプレッド", description: "コスト重視で選ぶ" },
                    { href: "/best/app", label: "アプリ重視", description: "操作性・反応速度で選ぶ" },
                    { href: "/best/tools", label: "取引ツール", description: "PCツール・機能面で選ぶ" },
                  ]}
                  variant="compact"
                />
              </section>
            </main>
            <LocalNavRail />
          </div>
        </Container>
      </div>
    </>
  );
}
