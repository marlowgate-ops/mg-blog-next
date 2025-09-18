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
    { q: "初心者はどれから始めるべき？", a: "まずは国内大手の総合力が高い口座で、入出金・約定スピード・アプリの感触を確認しましょう。1社目で基本操作に慣れ、用途（低コスト/アプリ/CFD等）ごとに2社目以降を使い分けるのが最短です。" },
    { q: "スプレッドと約定どちらを優先すべき？", a: "短期売買なら“提示の細さと約定の安定性”が最重要です。名目スプレッドが狭くても配信が粗いと実質コストは上がります。中長期は手数料やスワップ、入出金の手軽さを含めて総合で判断します。" },
    { q: "ランキングの基準は？", a: "手数料/スプレッド、約定・配信の安定性、取扱商品、アプリ/ツール、サポート/入出金の実用面を編集部で総合評価。広告掲載の有無に依らず独自基準で作成しています。最新状況は各社公式をご確認ください。" },
    { q: "海外業者はアリ？", a: "可能ですが、国内と比較して入出金・規制・税制・情報の非対称性が大きい点に注意。初心者はまず国内で基礎を固め、必要に応じて併用するのが安全です。" },
    { q: "複数口座を使い分けるべき？", a: "目的が違えば分けるのが合理的です。例）裁量デイトレ=低遅延/板重視、スイング=手数料総額とスワップ、情報収集=アプリUI/ニュースの充実。" },
    { q: "キャンペーンの活かし方は？", a: "口座開設〜入金・取引でポイント/現金の還元が受けられる場合があります。条件に該当するなら最初の1社で取りこぼさないのがコスパ良。" },
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

          {/* mg-top-toc */}
          <TocCard items={[
            { href: '#rank-all', label: '総合ランキング' },
            { href: '#table', label: '主要スペック比較' },
            { href: '#low-spread', label: '低スプレッドの選び方' },
            { href: '#apps', label: 'アプリの使い勝手' },
            { href: '#cost', label: 'コスト最適化の考え方' },
            { href: '#faq', label: 'Q&A' },
          ]} />
    
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
              <p className="mg-note">名目スプレッドは“入口の目安”。実戦では<strong>配信頻度・約定の安定性</strong>を合わせて見ると失敗しません。</p>
              <ul className="mg-bullets">
                <li><strong>主要ペアの提示の細かさ</strong>（ティック密度/更新頻度）…値が飛ばないか。</li>
                <li><strong>成行・逆指値の約定品質</strong>…混雑時にスリッページが増えないか。</li>
                <li>取引ツールの<strong>板/気配・ワンクリック</strong>…高速操作のしやすさ。</li>
                <li>実質コストは<strong>スプレッド±スワップ±手数料</strong>の総額で比較。</li>
              </ul>
              <div className="mg-callout info">短期売買がメインなら、名目スプレッドより<strong>配信と約定</strong>の安定度を優先しましょう。</div>
            </section>

            <section className="mg-section" id="apps" data-section>
              <h2>アプリの使い勝手</h2>
              <p>日々の意思決定を速くするのは<strong>UIと情報の近さ</strong>です。“迷わない導線”を重視。</p>
              <ul className="mg-bullets">
                <li>チャートのレイアウト保存、注文~決済の手順が短いか。</li>
                <li>アラート/ウィジェット、ニュースの粒度と更新速度。</li>
                <li>入出金や明細確認がアプリ内で完結するか。</li>
              </ul>
              <div className="mg-callout tip">“毎日触る前提”で、<strong>指が覚えるUI</strong>を選ぶとミスが減ります。</div>
            </section>

            <section className="mg-section" id="cost" data-section>
              <h2>コスト最適化の考え方</h2>
              <p className="mg-note">“1→2社目の乗り換え”よりも、<strong>用途での使い分け</strong>がコスパ最強。</p>
              <ol className="mg-steps">
                <li>メイン口座：総合力が高い1社で入出金・アプリも含めて安定運用。</li>
                <li>サブ口座：スキャル/自動売買など<strong>戦略特化</strong>に最適な1社を追加。</li>
                <li>中長期：スワップと諸費用、ニュース/銘柄の<strong>情報優位</strong>で選ぶ。</li>
              </ol>
              <p>キャンペーンは最初の1社で取りこぼさないのが鉄則。達成条件と締切だけは必ず確認を。</p>
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
              { title: '取引コスト徹底ガイド', href: '#cost', desc: 'スプレッド/手数料/スワップの実質コストを解説。中級者向けの最適化手順。' },
              { title: '人気ランキング', href: '#rank-all', desc: '今月の申込み/読了データから編集部がピックアップ。' },
              { title: '最新キャンペーン/経済指標', href: '#low-spread', desc: '口座開設特典と今週の主要指標をまとめてチェック。' },
            ]} />
          </aside>
        </div>
      </Container>
      <BackToTop />
    </>
  );
}
