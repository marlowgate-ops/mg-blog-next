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
    title: "GMOクリック証券レビュー", 
    description: "低コスト重視ユーザーの実体験",
    href: "/reviews/gmo",
    category: "review"
  },
  {
    title: "OANDA vs XM比較",
    description: "海外業者2社の詳細比較分析",
    href: "/compare/oanda-vs-xm",
    category: "compare"
  },
  {
    title: "口座開設完全ガイド",
    description: "必要書類から取引開始まで",
    href: "/how-to/open/guide",
    category: "guide"
  },
  {
    title: "ポジションサイズ計算ツール",
    description: "リスク管理に必須の計算機",
    href: "/tools/position-size",
    category: "tool"
  },
  {
    title: "スプレッド比較表",
    description: "主要通貨ペアの最新データ",
    href: "/best/low-spread",
    category: "compare"
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