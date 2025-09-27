import React from "react";
import Link from "next/link";
import s from "./RecirculationBand.module.css";

interface RecirculationCard {
  title: string;
  description: string;
  href: string;
  category: "review" | "compare" | "guide" | "tool";
}

const recirculationCards: RecirculationCard[] = [
  {
    title: "DMM.com証券レビュー",
    description: "国内最大手の使いやすさを詳細検証",
    href: "/reviews/dmm",
    category: "review"
  },
  {
    title: "総合ランキング",
    description: "使いやすさ重視の完全評価版",
    href: "/best/forex-brokers-jp",
    category: "compare"
  },
  {
    title: "低スプレッド業者比較",
    description: "コスト重視で選ぶ最適解",
    href: "/best/low-spread",
    category: "compare"
  },
  {
    title: "アプリ重視比較",
    description: "モバイル取引の操作性で選ぶ",
    href: "/best/app",
    category: "compare"
  },
  {
    title: "取引ツール比較",
    description: "チャート分析・自動売買対応",
    href: "/best/tools", 
    category: "tool"
  },
  {
    title: "キャンペーン一覧",
    description: "口座開設特典の最新情報",
    href: "/best/campaigns",
    category: "guide"
  },
  {
    title: "比較カテゴリ一覧",
    description: "目的別の業者選択ナビ",
    href: "/compare",
    category: "guide"
  },
  {
    title: "利用規約・免責事項",
    description: "サイト利用時の注意事項",
    href: "/disclaimer",
    category: "guide"
  }
];

export default function RecirculationBand() {
  return (
    <section className={s.recirculationSection} aria-label="関連コンテンツ">
      <div className={s.container}>
        <h2 className={s.sectionTitle}>
          <span className={s.titleIcon}>🔗</span>
          関連コンテンツ
        </h2>
        <div className={s.scrollContainer}>
          <div className={s.cardsGrid}>
            {recirculationCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className={`${s.card} ${s[`category-${card.category}`]}`}
              >
                <div className={s.cardContent}>
                  <h3 className={s.cardTitle}>{card.title}</h3>
                  <p className={s.cardDescription}>{card.description}</p>
                </div>
                <div className={s.cardArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}