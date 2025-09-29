import Container from "@/components/Container";
import HubTiles from "@/components/HubTiles";
import SectionBand from "@/components/SectionBand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbList } from "@/lib/seo/jsonld";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import s from "@/app/best/layout.module.css";

export const metadata = generateSEOMetadata({
  title: "FX・CFD業者比較ハブ",
  description: "用途別・特徴別でFX・CFD業者を比較。総合ランキング、低スプレッド、アプリ重視、取引ツールなど目的に応じた最適な選択をサポート。",
  path: "/compare",
});

export default function ComparePage() {
  const bc = breadcrumbList([
    { name: "比較ハブ", item: "/compare" },
  ]);

  return (
    <>
      <JsonLd data={bc} />
      <div className={s.page}>
        <Container>
          <div className={s.hero}>
            <h1>FX・CFD業者比較</h1>
            <p>
              目的・用途別で最適な業者を見つけてください。総合評価からコスト重視、アプリ重視まで、様々な角度で比較・評価しています。
            </p>
          </div>

          <HubTiles />

          <SectionBand variant="accent" id="categories">
            <section className={s.section} data-section>
              <h2>比較カテゴリー</h2>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <h3>
                    <a href="/best/forex-brokers-jp">総合ランキング</a>
                  </h3>
                  <p>使いやすさと実用性を重視した総合評価。初心者から中級者まで対応。</p>
                  <ul>
                    <li>スプレッド・手数料の総合コスト</li>
                    <li>約定品質と配信安定性</li>
                    <li>アプリ・ツールの実用性</li>
                    <li>入出金・サポート体制</li>
                  </ul>
                </div>

                <div className="comparison-card">
                  <h3>
                    <a href="/best/low-spread">低スプレッド特化</a>
                  </h3>
                  <p>取引コストを最優先に選択。スキャルピングやデイトレード向け。</p>
                  <ul>
                    <li>主要通貨ペアの最狭スプレッド</li>
                    <li>相場変動時の拡大傾向</li>
                    <li>配信頻度と約定安定性</li>
                    <li>総コスト効率の比較</li>
                  </ul>
                </div>

                <div className="comparison-card">
                  <h3>
                    <a href="/best/app">アプリ重視</a>
                  </h3>
                  <p>モバイル取引の操作性と機能性を重視した評価。</p>
                  <ul>
                    <li>UI/UXの直感性</li>
                    <li>チャート機能と分析ツール</li>
                    <li>注文・決済の操作効率</li>
                    <li>情報更新とアラート機能</li>
                  </ul>
                </div>

                <div className="comparison-card">
                  <h3>
                    <a href="/best/tools">取引ツール</a>
                  </h3>
                  <p>PC向け高機能ツールと分析機能で選択。</p>
                  <ul>
                    <li>チャート分析の高度機能</li>
                    <li>自動売買・EA対応</li>
                    <li>情報配信とニュース品質</li>
                    <li>カスタマイズ性能</li>
                  </ul>
                </div>

                <div className="comparison-card">
                  <h3>
                    <a href="/best/campaigns">キャンペーン</a>
                  </h3>
                  <p>口座開設特典と取引キャンペーンの比較。</p>
                  <ul>
                    <li>キャッシュバック金額と条件</li>
                    <li>達成可能性の評価</li>
                    <li>期限と制約事項</li>
                    <li>併用可能性の確認</li>
                  </ul>
                </div>
              </div>
            </section>
          </SectionBand>

          <SectionBand variant="subtle" id="selection-guide">
            <section className={s.section} data-section>
              <h2>選び方ガイド</h2>
              <div className="guide-content">
                <div className="guide-section">
                  <h3>初心者の方</h3>
                  <p>
                    まずは<strong>総合ランキング</strong>から始めることをおすすめします。
                    バランスの取れた業者で基本的な取引に慣れてから、用途別の最適化を検討しましょう。
                  </p>
                </div>
                
                <div className="guide-section">
                  <h3>コスト重視の方</h3>
                  <p>
                    <strong>低スプレッド特化</strong>で取引頻度とコスト効率を確認。
                    名目スプレッドだけでなく、約定品質との総合評価が重要です。
                  </p>
                </div>

                <div className="guide-section">
                  <h3>取引スタイル特化の方</h3>
                  <p>
                    スマホ中心なら<strong>アプリ重視</strong>、PC取引なら<strong>取引ツール</strong>。
                    ご自身の取引環境に合わせた選択が効率性向上につながります。
                  </p>
                </div>
              </div>
            </section>
          </SectionBand>
        </Container>
      </div>
    </>
  );
}