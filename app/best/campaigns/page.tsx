import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import JsonLd from "@/components/JsonLd";
import RankingList from "@/components/RankingList";
import CampaignsTable from "@/components/CampaignsTable";
import LocalNavRail from "@/components/LocalNavRail";
import Container from "@/components/Container";
import BottomRecirculation from "@/components/BottomRecirculation";
import HubTiles from "@/components/HubTiles";
import RecirculationBand from "@/components/RecirculationBand";
import EvaluationRules from "@/components/EvaluationRules";
import FAQ from "@/components/Faq";
import DisclaimerBox from "@/components/DisclaimerBox";
import SectionBand from "@/components/SectionBand";
import LongForm from "@/components/LongForm";
import StickyCTA from "@/components/StickyCTA";
import { breadcrumbList, itemListJSONLD, faqPage } from "@/lib/seo/jsonld";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import s from "@/app/best/layout.module.css";
import longformContent from "@/content_source/reviews/campaigns/longform.json";
import faqData from "@/content_source/reviews/campaigns/faq.json";

export const metadata = generateSEOMetadata({
  title: "口座開設キャンペーン一覧",
  description: "最大額/締切/条件で横断比較。やるべきコト、遅れをとらない選択記法。",
  path: "/best/campaigns",
});

export default function Page() {
  const bc = breadcrumbList([
    { name: "比較", item: "/best" },
    { name: "キャンペーン", item: "/best/campaigns" },
  ]);
  const il = itemListJSONLD("口座開設キャンペーン一覧", [
    { name: "DMM FX", url: "/best/forex-brokers-jp#rank-1" },
    { name: "GMOクリック", url: "/best/forex-brokers-jp#rank-2" },
  ]);
  const faqLd = faqPage(faqData.map(item => ({ q: item.question, a: item.answer })));

  return (
    <>
      <JsonLd data={bc} />
      <JsonLd data={il} />
      <JsonLd data={faqLd} />
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

              <StickyCTA href="#compare" deadline="2025-12-31" />

              <HubTiles />

              <SectionBand variant="accent" id="compare">
                <section className={s.section} data-section>
                  <h2>キャンペーン一覧</h2>
                  <CampaignsTable />
                </section>
              </SectionBand>

              <SectionBand variant="weak" id="eval">
                <section className={s.section} data-section>
                  <EvaluationRules />
                </section>
              </SectionBand>
              <SectionBand variant="strong" id="how-to-choose">
                <section className={s.section} data-section>
                  <h2>キャンペーン活用ガイド</h2>
                  <LongForm sections={[
                    {
                      id: "guide-intro",
                      title: "キャンペーン選択の基本",
                      prose: (
                        <p>{longformContent.intro}</p>
                      )
                    },
                    {
                      id: "evaluation-criteria",
                      title: "評価基準の詳細",
                      prose: (
                        <p>{longformContent.criteria}</p>
                      )
                    },
                    {
                      id: "use-case-strategies",
                      title: "活用戦略パターン",
                      prose: (
                        <p>{longformContent["use-cases"]}</p>
                      )
                    },
                    {
                      id: "common-mistakes",
                      title: "よくある失敗例",
                      prose: (
                        <p>{longformContent.mistakes}</p>
                      )
                    },
                    {
                      id: "action-guide",
                      title: "効果的な活用法",
                      prose: (
                        <p>{longformContent.cta}</p>
                      )
                    }
                  ]} />
                </section>
              </SectionBand>

              <SectionBand variant="subtle" id="faq">
                <section className={s.section} data-section>
                  <FAQ items={faqData.map(item => ({ q: item.question, a: item.answer }))} />
                </section>
              </SectionBand>

              <RecirculationBand />

              <DisclaimerBox />

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
            </main>
            <LocalNavRail />
          </div>
        </Container>
      </div>
    </>
  );
}
