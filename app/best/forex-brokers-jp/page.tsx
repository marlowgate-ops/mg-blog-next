"use client";
import React from "react";
import Container from "@/components/Container";
import PrBadge from "@/components/PrBadge";
import IconNav from "@/components/IconNav";
import TocCard from "@/components/TocCard";
import SideCards from "@/components/SideCards";
import RankingCard from "@/components/RankingCard";
import ComparisonTable from "@/components/ComparisonTable";
import JsonLd from "@/components/JsonLd";
import BackToTop from "@/components/BackToTop";
import { brokers } from "@/data/brokers";
import { breadcrumbList, itemListJSONLD, faqPage, organization } from "@/lib/seo/jsonld";
import "./styles.css";

export default function Page() {
  const faqs = [
    { q: "初心者はどれから見れば良い？", a: "まずは国内サービス（例: DMM.com証券）で入出金・約定の動作を確認してから、用途に応じて他社を検討するのがおすすめです。" },
    { q: "ランキングの序列は？", a: "手数料・約定・取扱商品の客観指標をベースに、編集部で総合判断しています。最新の状況は各社の公式をご確認ください。" },
    { q: "海外業者も使えますか？", a: "可能ですが、規制・入出金・税務の理解が前提です。国内と併用する形を推奨します。" },
  ];
  const itemsLd = itemListJSONLD("国内向けおすすめFX・CFD業者ランキング", brokers.map(b=>({ name:b.name, url:b.site, ratingValue:b.score })));
  const bc = breadcrumbList([{ name:"トップ", item:"/" }, { name:"比較", item:"/best" }, { name:"FX・CFD業者ランキング", item:"/best/forex-brokers-jp" }]);
  const faqLd = faqPage(faqs);

  return (
    <>
      <JsonLd data={bc} />
      <JsonLd data={itemsLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={organization()} />

      <Container>
        <div className="mg-hero">
          <PrBadge />
          <h1>【2025年版】国内向けおすすめFX・CFD業者ランキング</h1>
          <p>初心者〜中級まで“使いやすさ”と“実用性”を重視。国内サービス中心に、スプレッド/手数料、約定、入出金、サポートを総合評価。</p>
          <div className="mg-tabs" aria-label="用途別タブ">
            <a className="mg-tab is-active" href="#rank-all">総合</a>
            <a className="mg-tab" href="#low-spread">低スプレッド</a>
            <a className="mg-tab" href="#cost">手数料重視</a>
            <a className="mg-tab" href="#apps">アプリ重視</a>
          </div>
          <IconNav />
                    <a className="mg-lead-cta" href="#table">口座開設の最新特典を確認</a>
        </div>

        <div className="mg-grid">
          <main>
            <section className="mg-section" id="rank-all" aria-labelledby="rank-all-title" data-section>
              <h2 id="rank-all-title">総合ランキング</h2>
              {brokers.map((b, i)=>(
                <RankingCard key={b.id} rank={i+1} brand={b.name} score={b.score} highlights={b.pros} cautions={b.cons} ctaHref={b.site} state={b.state} subs={b.subs}/>
              ))}
            </section>

            <section className="mg-section" id="table" data-section>
              <h2>主要スペック比較</h2>
              <ComparisonTable rows={brokers.map(b=>({ brand:b.name, product:"FX", platform:"Web / アプリ", cost:"—", note:"—", state:b.state, ctaHref:b.site }))} />
            </section>

            <section className="mg-section" id="low-spread" data-section>
              <h2>低スプレッドの選び方</h2>
              <p className="mg-note">スプレッドは相場や時間帯で変動します。最新情報は各社の公式でご確認ください。</p>
              <ul className="mg-bullets"><li>主要通貨ペアの配信品質（提示頻度/滑り）とセットで評価。</li><li>スキャルや短期取引は板/約定性能との相性が重要。</li></ul>
            </section>

            <section className="mg-section" id="apps" data-section>
              <h2>アプリの使い勝手</h2>
              <ul className="mg-bullets"><li>チャート操作（描画/発注までのタップ数）。</li><li>通知（約定/指標/価格アラート）と安定性。</li></ul>
            </section>

            <section className="mg-section" id="cost" data-section>
              <h2>コスト最適化の考え方</h2>
              <ul className="mg-bullets"><li>スプレッド/手数料/スワップ/入出金コストの総和で比較。</li><li>キャンペーンは一時的。平時コストと品質を基準化。</li></ul>
            </section>

            <section className="mg-section mg-faq" id="faq" data-section>
              <h2>よくある質問</h2>
              <TocCard items={[
                { href: '#rank-all', label: '総合ランキング' },
                { href: '#table', label: '主要スペック比較' },
                { href: '#low-spread', label: '低スプレッドの選び方' },
                { href: '#apps', label: 'アプリの使い勝手' },
                { href: '#cost', label: 'コスト最適化の考え方' },
                { href: '#faq', label: 'Q&A' },
              ]} />
              <details><summary>初心者はどれから？</summary><p>まずは国内サービス（例: DMM.com証券）で入出金の動作を確認。小額から始め、約定やアプリの使い勝手を確かめるのがおすすめです。</p></details>
              <details><summary>ランキングの根拠は？</summary><p>手数料・約定・取扱商品の客観指標をベースに編集部で総合判断。広告掲載の有無とは独立して評価します。</p></details>
              <details><summary>海外業者も使える？</summary><p>可能ですが、規制・入出金・税務の理解が前提。国内と併用しつつ、自身の運用ルールに合うか慎重に判断してください。</p></details>
            </section>
          </main>

          <aside className="mg-side" aria-label="注目コンテンツ">
            <SideCards cards={[
              { title: '取引手数料（中級者向け）', href: '#cost', desc: '主要銘柄の比較。詳細はアップデート予定。' },
              { title: '人気ランキング', href: '#rank-all', desc: '今月の申込み傾向からピックアップ。' },
              { title: '投資情報', href: '#low-spread', desc: '最新のキャンペーンや指標カレンダーへ。' },
            ]} />
          </aside>
        </div>
      </Container>
      <BackToTop />
    </>
  );
}
