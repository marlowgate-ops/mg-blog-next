import React from "react";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import AuthorMeta from "@/components/AuthorMeta";
import PrBadge from "@/components/PrBadge";
import FAQ from "@/components/FAQ";
import IconNav from "@/components/IconNav";
import TocCard from "@/components/TocCard";
import BottomToc from "@/components/BottomToc";
import PrimaryCta from "@/components/PrimaryCta";
import SideCards from "@/components/SideCards";
import RankingCardNew from "@/components/RankingCardNew";
import CompareTable from "@/components/CompareTable";
import JsonLd from "@/components/JsonLd";
import BackToTop from "@/components/BackToTop";
import ReviewContent from "@/components/ReviewContent";
import HeaderMeta from "@/components/HeaderMeta";
import SectionBand from "@/components/SectionBand";
import LongForm from "@/components/LongForm";
import { brokers } from "@/data/brokers";
import {
  breadcrumbList,
  itemListJSONLD,
  faqPage,
  organization,
} from "@/lib/seo/jsonld";
import EvaluationCriteria from "@/components/EvaluationCriteria";
import CostsTable from "@/components/CostsTable";
import Reviews from "@/components/Reviews";
import AuthorBio from "@/components/AuthorBio";
import PollWidget from "@/components/PollWidget";
import StickyCTA from "@/components/StickyCTA";
import CategoryTiles from "@/components/CategoryTiles";
import LocalNavRail from "@/components/LocalNavRail";
import s from "@/app/best/layout.module.css";

export const metadata = {
  title: "国内向けおすすめFX・CFD業者ランキング",
  description:
    "使いやすさ/実用性を重視。スプレッド・手数料・約定・アプリ・サポートを総合評価。",
};

// Evaluation data is now loaded from JSON

// Simple logo component for brokers
function BrokerLogo({ name }: { name: string }) {
  const initials = name
    .replace(/[（(].*?[)）]/g, '')
    .split(/[・\s]/)
    .map(x => x[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  
  return <span style={{ fontSize: '14px', fontWeight: 700 }}>{initials}</span>;
}

export default function Page() {

  const faqs = [
    {
      q: "初心者はどれから始めるべき？",
      a: "まずは国内大手の総合力が高い口座で、入出金・約定スピード・アプリの感触を確認しましょう。1社目で基本操作に慣れ、用途（低コスト/アプリ/CFD等）ごとに2社目以降を使い分けるのが最短です。",
    },
    {
      q: "スプレッドと約定どちらを優先すべき？",
      a: "短期売買なら“提示の細さと約定の安定性”が最重要です。名目スプレッドが狭くても配信が粗いと実質コストは上がります。中長期は手数料やスワップ、入出金の手軽さを含めて総合で判断します。",
    },
    {
      q: "ランキングの基準は？",
      a: "手数料/スプレッド、約定・配信の安定性、取扱商品、アプリ/ツール、サポート/入出金の実用面を編集部で総合評価。広告掲載の有無に依らず独自基準で作成しています。最新状況は各社公式をご確認ください。",
    },
    {
      q: "海外業者はアリ？",
      a: "可能ですが、国内と比較して入出金・規制・税制・情報の非対称性が大きい点に注意。初心者はまず国内で基礎を固め、必要に応じて併用するのが安全です。",
    },
    {
      q: "複数口座を使い分けるべき？",
      a: "目的が違えば分けるのが合理的です。例）裁量デイトレ=低遅延/板重視、スイング=手数料総額とスワップ、情報収集=アプリUI/ニュースの充実。",
    },
    {
      q: "キャンペーンの活かし方は？",
      a: "口座開設〜入金・取引でポイント/現金の還元が受けられる場合があります。条件に該当するなら最初の1社で取りこぼさないのがコスパ良。",
    },
  ];
  const itemsLd = itemListJSONLD(
    "国内向けおすすめFX・CFD業者ランキング",
    brokers.map((b) => ({ name: b.name, url: b.site, ratingValue: b.score }))
  );
  const bc = breadcrumbList([
    { name: "トップ", item: "/" },
    { name: "比較", item: "/best" },
    { name: "FX・CFD業者ランキング", item: "/best/forex-brokers-jp" },
  ]);
  const faqLd = faqPage(faqs);

  const rows = brokers.map((b, index) => {
    // Add sample tags based on broker characteristics
    const tags: string[] = []
    if (index < 3) tags.push('初心者向け')
    if (b.name.includes('スプレッド') || b.costNote?.includes('0.') || index % 2 === 0) {
      tags.push('低スプレッド')
    }
    if (b.platform?.includes('MT4') || b.name.includes('FXTF') || index % 3 === 0) {
      tags.push('MT4対応')
    }
    if (b.score && Number(b.score) > 85) tags.push('高評価')
    if (b.name.includes('SBI') || b.name.includes('楽天')) {
      tags.push('大手証券系')
    }

    return {
      brand: b.name,
      product: b.product,
      platform: b.platform,
      cost: b.costNote,
      minUnit: b.minUnit,
      accountFee: b.accountFee,
      depositWithdraw: b.depositWithdraw,
      api: b.api,
      tools: b.tools,
      appScore: b.appScoreText,
      support: b.support,
      note: b.note,
      state: b.state,
      ctaHref: b.site,
      tags,
    };
  });

  return (
    <>
      <JsonLd data={bc} />
      <JsonLd data={itemsLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={organization()} />

      <div className={s.page}>
        <Container>
          <HeaderMeta>
            <PrBadge />
          </HeaderMeta>
          <div className={s.hero}>
            <h1>【2025年版】国内向けおすすめFX・CFD業者ランキング</h1>
            <CategoryTiles />
            <TocCard />
            <p>
              初心者〜中級まで“使いやすさ”と“実用性”を重視。国内サービス中心に、スプレッド/手数料、約定、入出金、サポートを総合評価。
            </p>
            <AuthorMeta />
            <div className={s.tabs} aria-label="用途別タブ">
              <a className={`${s.tab} ${s.on}`} href="#rank-all">
                総合
              </a>
              <a className={s.tab} href="#low-spread">
                低スプレッド
              </a>
              <a className={s.tab} href="#cost">
                手数料重視
              </a>
              <a className={s.tab} href="#apps">
                アプリ重視
              </a>
            </div>
            <IconNav />
            <a className={s.leadCta} href="#table">
              口座開設の最新特典を確認
            </a>
          </div>

          <StickyCTA href="#table" deadline="2025-12-31" />

          <div className={s.grid}>
            <main>
              <section
                className={s.section}
                id="ranking"
                aria-labelledby="ranking-title"
                data-section
              >
                <h2 id="ranking-title" className={s.sectionTitle}><span className={s.bar} />総合ランキング</h2>
                <div className={s.rankingGrid}>
                  {brokers.map((broker, index) => (
                    <RankingCardNew
                      key={broker.id}
                      logo={<BrokerLogo name={broker.name} />}
                      name={broker.name}
                      highlights={broker.pros}
                      caveats={broker.cons}
                      ctaHref={broker.site || '#'}
                      badge={`${index + 1}位`}
                      score={broker.score}
                      subscores={{
                        cost: broker.subs.cost,
                        reliability: broker.subs.execution,
                        app: broker.subs.app,
                      }}
                    />
                  ))}
                </div>
              </section>

              <SectionBand variant="weak" id="compare">
                <section className={s.section} data-section>
                  <h2 className={s.sectionTitle}><span className={s.bar} />主要スペック比較</h2>
                  <CompareTable rows={rows} />
                </section>
              </SectionBand>

              <SectionBand variant="strong" id="eval">
                <section className={s.section} data-section>
                  <EvaluationCriteria />
                </section>
              </SectionBand>

              <SectionBand variant="weak" id="deep-dive">
                <section className={s.section} data-section>
                  <h2>徹底解説</h2>
                  <LongForm sections={[
                    {
                      id: "selection-criteria",
                      title: "業者選択の詳細基準",
                      prose: (
                        <>
                          <p>
                            国内FX業者選択では、スプレッドの名目値だけでは判断できません。
                            実際の取引では配信頻度と約定の安定性が重要になります。
                          </p>
                          <ul>
                            <li><strong>ティック密度と更新頻度</strong>：主要ペアで値が飛ばないか、細かく提示されるかを確認</li>
                            <li><strong>約定品質の検証</strong>：成行・逆指値で混雑時にスリッページが増えないかをチェック</li>
                            <li><strong>操作効率</strong>：板/気配表示とワンクリック注文の高速性を評価</li>
                            <li><strong>総コスト計算</strong>：スプレッド・スワップ・手数料を総合して比較</li>
                          </ul>
                          <p>
                            短期売買がメインの場合は、名目スプレッドより配信と約定の安定度を優先することが失敗を避けるポイントです。
                          </p>
                        </>
                      )
                    },
                    {
                      id: "app-usability",
                      title: "アプリの実用性評価",
                      prose: (
                        <>
                          <p>
                            日々の意思決定を速くするには、UIと情報の近さが決定的です。
                            迷わない導線設計が取引効率を大きく左右します。
                          </p>
                          <ul>
                            <li><strong>レイアウトの記憶機能</strong>：チャート設定と注文〜決済の手順が短縮できるか</li>
                            <li><strong>情報更新の質</strong>：アラート、ウィジェット、ニュースの粒度と更新速度</li>
                            <li><strong>完結性</strong>：入出金や取引明細の確認がアプリ内で完結するか</li>
                          </ul>
                          <p>
                            毎日触る前提で、指が覚えるUIを選ぶとミスが減ります。
                            初期の学習コストよりも、長期的な操作効率を重視しましょう。
                          </p>
                        </>
                      )
                    },
                    {
                      id: "cost-optimization",
                      title: "コスト最適化戦略",
                      prose: (
                        <>
                          <p>
                            1社目から2社目への単純乗り換えよりも、用途での使い分けがコストパフォーマンス最強のアプローチです。
                          </p>
                          <ol>
                            <li><strong>メイン口座</strong>：総合力が高い1社で入出金・アプリも含めた安定運用を重視</li>
                            <li><strong>サブ口座</strong>：スキャルピングや自動売買など戦略特化に最適な1社を追加</li>
                            <li><strong>中長期口座</strong>：スワップと諸費用、ニュース・銘柄の情報優位性で選択</li>
                          </ol>
                          <p>
                            キャンペーンは最初の1社で取りこぼさないのが鉄則。
                            達成条件と締切は必ず事前確認しましょう。
                          </p>
                        </>
                      )
                    },
                    {
                      id: "broker-highlights",
                      title: "主要業者の特徴まとめ",
                      prose: (
                        <>
                          <p>
                            各業者の強みと注意点を、実際の取引シーンに合わせて整理しました。
                          </p>
                          <div>
                            <h4>DMM.com証券</h4>
                            <p>約定と配信の安定性、直感的なアプリ、高速な入出金が強み。日中の一部時間帯でスプレッド拡大があることは把握しておきましょう。</p>
                            
                            <h4>GMOクリック証券</h4>
                            <p>板とワンクリック操作に優れ、PC向け高機能ツールを提供。一部通貨で広がりがあることに注意。</p>
                            
                            <h4>FXTF</h4>
                            <p>MT4対応で裁量取引の拡張性に優れる。時間帯によるスプレッド拡大を考慮した運用が必要。</p>
                            
                            <h4>松井証券</h4>
                            <p>証券基盤の堅牢性が魅力。UIはシンプル志向で、複雑な機能よりも安定性を重視する利用者向け。</p>
                          </div>
                        </>
                      )
                    }
                  ]} />
                </section>
              </SectionBand>

              <section className={s.section} id="how-to-choose" data-section>
                <h2>低スプレッドの選び方</h2>
                <p className={s.note}>
                  名目スプレッドは“入口の目安”。実戦では
                  <strong>配信頻度・約定の安定性</strong>
                  を合わせて見ると失敗しません。
                </p>
                <ul className={s.bullets}>
                  <li>
                    <strong>主要ペアの提示の細かさ</strong>
                    （ティック密度/更新頻度）…値が飛ばないか。
                  </li>
                  <li>
                    <strong>成行・逆指値の約定品質</strong>
                    …混雑時にスリッページが増えないか。
                  </li>
                  <li>
                    取引ツールの<strong>板/気配・ワンクリック</strong>
                    …高速操作のしやすさ。
                  </li>
                  <li>
                    実質コストは<strong>スプレッド±スワップ±手数料</strong>
                    の総額で比較。
                  </li>
                </ul>
                <div className={s.callout}>
                  短期売買がメインなら、名目スプレッドより
                  <strong>配信と約定</strong>の安定度を優先しましょう。
                </div>
              </section>

              <section className={s.section} id="app-ux" data-section>
                <h2>アプリの使い勝手</h2>
                <p>
                  日々の意思決定を速くするのは<strong>UIと情報の近さ</strong>
                  です。“迷わない導線”を重視。
                </p>
                <ul className={s.bullets}>
                  <li>チャートのレイアウト保存、注文~決済の手順が短いか。</li>
                  <li>アラート/ウィジェット、ニュースの粒度と更新速度。</li>
                  <li>入出金や明細確認がアプリ内で完結するか。</li>
                </ul>
                <div className={s.callout}>
                  “毎日触る前提”で、<strong>指が覚えるUI</strong>
                  を選ぶとミスが減ります。
                </div>
              </section>

              <section className={s.section} id="cost-opt" data-section>
                <h2>コスト最適化の考え方</h2>
                <p className={s.note}>
                  “1→2社目の乗り換え”よりも、<strong>用途での使い分け</strong>
                  がコスパ最強。
                </p>
                <ol className={s.steps}>
                  <li>
                    メイン口座：総合力が高い1社で入出金・アプリも含めて安定運用。
                  </li>
                  <li>
                    サブ口座：スキャル/自動売買など<strong>戦略特化</strong>
                    に最適な1社を追加。
                  </li>
                  <li>
                    中長期：スワップと諸費用、ニュース/銘柄の
                    <strong>情報優位</strong>で選ぶ。
                  </li>
                </ol>
                <p>
                  キャンペーンは最初の1社で取りこぼさないのが鉄則。達成条件と締切だけは必ず確認を。
                </p>
              </section>

              <section
                className={`${s.section} ${s.faq}`}
                id="faq"
                data-section
              >
                <h2>よくある質問</h2>
                <details>
                  <summary>初心者はどれから？</summary>
                  <p>
                    まずは国内サービス（例:
                    DMM.com証券）で入出金の動作を確認。小額から始め、約定やアプリの使い勝手を確かめるのがおすすめです。
                  </p>
                </details>
                <details>
                  <summary>ランキングの根拠は？</summary>
                  <p>
                    手数料・約定・取扱商品の客観指標をベースに編集部で総合判断。広告掲載の有無とは独立して評価します。
                  </p>
                </details>
                <details>
                  <summary>海外業者も使える？</summary>
                  <p>
                    可能ですが、規制・入出金・税務の理解が前提。国内と併用しつつ、自身の運用ルールに合うか慎重に判断してください。
                  </p>
                </details>
              </section>

              <section className={s.section} id="campaign" data-section>
                <h2>口座開設キャンペーン</h2>
                <p className={s.note}>
                  最新の口座開設特典や取引キャンペーンは、公式サイトで条件をご確認ください。
                </p>
                <ul className={s.bullets}>
                  <li>新規口座＋入金でポイント/現金の還元</li>
                  <li>取引量に応じたキャッシュバック</li>
                  <li>アプリ利用・学習コンテンツの特典 など</li>
                </ul>
              </section>

              <section className={s.section} id="popular" data-section>
                <h2>今月の人気</h2>
                <p>
                  今月よく読まれたレビューと申込が多かった口座のピックアップ。
                </p>
                <ul className={s.bullets}>
                  <li>DMM.com証券 — 総合バランスの良さ</li>
                  <li>
                    ゴールデンウェイ・ジャパン（FXTF） — MT4系ツールの柔軟性
                  </li>
                </ul>
              </section>

              <section className={s.section} id="costs" data-section>
                <h2>取引コストの実質比較（1 lot想定）</h2>
                <CostsTable />
              </section>

              <section className={s.section} id="reviews" data-section>
                <h2>口コミ・評判（抜粋）</h2>
                <Reviews />
              </section>

              <section className={s.section} id="poll" data-section>
                <h2>読者アンケート</h2>
                <PollWidget />
              </section>

              <section className={s.section} id="author" data-section>
                <h2>このページの編集体制</h2>
                <AuthorBio />
              </section>
            </main>
            <LocalNavRail />

            <aside className={s.side} aria-label="注目コンテンツ">
              <div className="card">
                <SideCards
                  cards={[
                    {
                      title: "取引コスト徹底ガイド",
                      href: "#cost",
                      desc: "スプレッド/手数料/スワップの実質コストを解説。中級者向けの最適化手順。",
                    },
                    {
                      title: "人気ランキング",
                      href: "#rank-all",
                      desc: "今月の申込み/読了データから編集部がピックアップ。",
                    },
                    {
                      title: "最新キャンペーン/経済指標",
                      href: "#low-spread",
                      desc: "口座開設特典と今週の主要指標をまとめてチェック。",
                    },
                  ]}
                />
              </div>
            </aside>
          </div>

          <section className={s.section} id="detail-reviews" data-section>
            <h2>詳細レビュー</h2>
            <div className={s.review}>
              <h3>DMM.com証券｜総合力で迷ったら</h3>
              <ReviewContent id="dmm" />
            </div>
            <div className={s.review}>
              <h3>松井証券（準備中）｜堅実さ重視のサブ候補</h3>
              <ReviewContent id="matsui" />
            </div>
            <div className={s.review}>
              <h3>
                ゴールデンウェイ・ジャパン（FXTF）｜ツールで攻めたい中級者へ
              </h3>
              <ReviewContent id="fxtf" />
            </div>
          </section>
          
          {/* Bottom navigation for easy access to all sections */}
          <BottomToc />
        </Container>
      </div>
      <BackToTop />
    </>
  );
}
