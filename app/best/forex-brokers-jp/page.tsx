"use client";
import React from "react";
import Container from "@/components/Container";
import PrBadge from "@/components/PrBadge";
import IconNav from "@/components/IconNav";
import TocCard from "@/components/TocCard";
import SideCards from "@/components/SideCards";
import RankingCard from "@/components/RankingCard";
import ComparisonTable from "@/components/ComparisonTable";
import "./styles.css";

export default function Page() {
  return (
    <>
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
            <section className="mg-section" id="rank-all" aria-labelledby="rank-all-title">
              <h2 id="rank-all-title">総合ランキング</h2>
              <RankingCard
                rank={1}
                brand="DMM.com証券"
                score={4.4}
                highlights={["国内大手で情報量が豊富","約定スピードに定評"]}
                cautions={["キャンペーン期以外は条件が平凡"]}
                ctaHref={process.env.NEXT_PUBLIC_AFF_DMM || "#"}
                ctaLabel="公式サイトで口座開設"
              />
              <RankingCard rank={2} brand="松井証券（準備中）" score={0.0} highlights={["準備中"]} state="preparing" />
              <RankingCard
                rank={3}
                brand="ゴールデンウェイ・ジャパン（FXTF）"
                score={3.6}
                highlights={["スワップ・キャンペーン","一部に定評"]}
                cautions={["ECNに近い設計","情報量は大手に劣る"]}
                ctaHref={process.env.NEXT_PUBLIC_AFF_FXTF || "#"}
                ctaLabel="公式サイトで口座開設"
              />
            </section>

            <section className="mg-section" id="table">
              <h2>主要スペック比較</h2>
              <ComparisonTable
                rows={[
                  { brand: "DMM.com証券", product: "FX", platform: "Web / アプリ", cost: "—", note: "—", ctaHref: process.env.NEXT_PUBLIC_AFF_DMM || "#" },
                  { brand: "松井証券（準備中）", product: "FX", platform: "Web / アプリ", cost: "—", note: "—", state: "preparing" },
                  { brand: "ゴールデンウェイ・ジャパン（FXTF）", product: "FX", platform: "Web / アプリ", cost: "—", note: "—", ctaHref: process.env.NEXT_PUBLIC_AFF_FXTF || "#" },
                ]}
              />
            </section>

            <section className="mg-section mg-faq" id="faq">
              <h2>よくある質問</h2>
              <TocCard items={[
                { href: '#rank-all', label: '総合ランキング' },
                { href: '#table', label: '主要スペック比較' },
                { href: '#low-spread', label: '低スプレッドの選び方' },
                { href: '#apps', label: 'アプリの使い勝手' },
                { href: '#cost', label: 'コスト最適化の考え方' },
                { href: '#faq-bottom', label: 'Q&A' },
              ]} />
              <div id="faq-bottom" />
              <details><summary>初心者はどれから見れば良い？</summary><p>まずは国内サービス（例: DMM.com証券）で入出金・約定の動作を確認してから、用途に応じて他社を検討するのがおすすめです。</p></details>
              <details><summary>ランキングの序列は？</summary><p>手数料・約定・取扱商品の客観指標をベースに、編集部で総合判断しています。最新の状況は各社の公式をご確認ください。</p></details>
              <details><summary>海外業者も使えますか？</summary><p>可能ですが、規制・入出金・税務の理解が前提です。国内と併用する形を推奨します。</p></details>
            </section>
          </main>

          <aside className="mg-side" aria-label="注目コンテンツ">
            <SideCards cards={[
              { title: '取引手数料（中級者向け）', href: '#cost', desc: '主要銘柄の比較。詳細は次回アップデートで公開。' },
              { title: '人気ランキング', href: '#popular', desc: '今月の申込み傾向からピックアップ。' },
              { title: '投資情報', href: '#campaign', desc: '最新のキャンペーンや指標カレンダーへ。' },
            ]} />
          </aside>
        </div>
      </Container>
    </>
  );
}
