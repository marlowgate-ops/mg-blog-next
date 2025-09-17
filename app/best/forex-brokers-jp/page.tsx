import React from "react";
import HeroTabs from "../../../components/HeroTabs";
import RankCard from "../../../components/RankCard";
import SpecTable from "../../../components/SpecTable";
import Faq from "../../../components/Faq";
import JsonLd from "../../../components/JsonLd";
import { brokers } from "../../../data/brokers";
import { breadcrumbList, itemListJSONLD, faqPage } from "../../../lib/seo/jsonld";

export const metadata = {
  title: "【2025年版】国内向けおすすめFX・CFD業者ランキング",
  description:
    "初心者〜中級まで“使いやすさ”と“実用性”を重視。国内サービス中心に、スプレッド/手数料、約定、入出金、サポートを総合評価。",
  alternates: { canonical: "/best/forex-brokers-jp" },
  openGraph: {
    title: "【2025年版】国内向けおすすめFX・CFD業者ランキング",
    description:
      "初心者〜中級まで“使いやすさ”と“実用性”を重視。国内サービス中心に、スプレッド/手数料、約定、入出金、サポートを総合評価。",
  },
};

export default function Page() {
  const faqs = [
    {
      q: "初心者はどれから？",
      a: "まずは国内サービス（例: DMM.com証券）で入出金の動作を確認。小額から始め、約定やアプリの使い勝手を確かめるのがおすすめです。",
    },
    {
      q: "ランキングの根拠は？",
      a: "手数料・約定・取扱商品の客観指標をベースに編集部で総合判断。広告掲載の有無とは独立して評価します。",
    },
    {
      q: "海外業者も使える？",
      a: "可能ですが、規制・入出金・税務の理解が前提。国内と併用しつつ、自身の運用ルールに合うか慎重に判断してください。",
    },
  ];

  const itemsLd = itemListJSONLD(
    "国内向けおすすめFX・CFD業者ランキング",
    brokers.map((b, idx) => ({
      name: b.name,
      url: b.site,
      ratingValue: b.score || undefined,
      position: idx + 1,
    }))
  );
  const bc = breadcrumbList([
    { name: "トップ", item: "/" },
    { name: "比較", item: "/best" },
    { name: "FX・CFD業者ランキング", item: "/best/forex-brokers-jp" },
  ]);
  const faqLd = faqPage(faqs);

  return (
    <main style={{ display: "grid", gap: 24 }}>
      <JsonLd data={bc} />
      <JsonLd data={itemsLd} />
      <JsonLd data={faqLd} />

      <HeroTabs />

      <section style={{ display: "grid", gap: 12 }}>
        {brokers.map((b, i) => (
          <RankCard key={b.id} rank={i + 1} broker={b} />
        ))}
      </section>

      <SpecTable rows={brokers} />
      <Faq items={faqs} />
    </main>
  );
}
