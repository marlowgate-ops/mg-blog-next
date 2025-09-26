import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import RankingList from "@/components/RankingList";
import LocalNavRail from "@/components/LocalNavRail";
import Container from "@/components/Container";
import BottomRecirculation from "@/components/BottomRecirculation";
import { breadcrumbList, itemListJSONLD } from "@/lib/seo/jsonld";
import Link from "next/link";
import s from "@/app/best/layout.module.css";

export const metadata = {
  title: "取引ツール・機能で選ぶ",
  description: "PCツールの拡張性やAPI対応など、機能面で選ぶ。",
};

export default function Page() {
  const bc = breadcrumbList([
    { name: "比較", item: "/best" },
    { name: "取引ツール", item: "/best/tools" },
  ]);
  const il = itemListJSONLD("取引ツール・機能で選ぶ", [
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
                  items={[{ name: "比較", href: "/best" }, { name: "取引ツール" }]}
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
                  取引ツール・機能で選ぶ
                </h1>
                <p style={{ color: "#475569", margin: "0 0 12px" }}>
                  PCツールの拡張性やAPI対応など、機能面で選ぶ。
                </p>

                <div className="section-card">
                  <h2 style={{ fontSize: 18, margin: "12px 0" }}>
                    ランキング
                  </h2>
                  <RankingList mode="execution" limit={10} />
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
                    { href: "/best/campaigns", label: "キャンペーン", description: "口座開設特典一覧" },
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
