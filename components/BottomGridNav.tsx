"use client";

import React from "react";
import Link from "next/link";
import s from "./BottomGridNav.module.css";

interface BottomGridNavItem {
  title: string;
  href: string;
  description: string;
  category: "tool" | "guide" | "comparison" | "other";
}

const BOTTOM_NAV_ITEMS: BottomGridNavItem[] = [
  {
    title: "スプレッド比較",
    href: "/best/low-spread",
    description: "主要通貨ペアのスプレッド一覧",
    category: "comparison",
  },
  {
    title: "MT4対応業者",
    href: "/best/tools",
    description: "MT4/MT5プラットフォーム対応",
    category: "tool",
  },
  {
    title: "キャンペーン情報", 
    href: "/best/campaigns",
    description: "口座開設特典・キャッシュバック",
    category: "other",
  },
  {
    title: "アプリ比較",
    href: "/best/app", 
    description: "スマホアプリの機能・使いやすさ",
    category: "comparison",
  },
  {
    title: "FX基礎知識",
    href: "/blog",
    description: "初心者向け解説記事",
    category: "guide",
  },
  {
    title: "業者レビュー",
    href: "/reviews/dmm",
    description: "実際の利用体験レポート", 
    category: "guide",
  },
];

export default function BottomGridNav() {
  return (
    <section className={s.bottomGrid}>
      <div className={s.container}>
        <h2 className={s.title}>関連情報</h2>
        <div className={s.grid}>
          {BOTTOM_NAV_ITEMS.map((item, index) => (
            <Link key={index} href={item.href} className={s.gridItem}>
              <div className={`${s.iconWrapper} ${s[`category-${item.category}`]}`}>
                <span className={s.icon}>
                  {item.category === "tool" && "⚙️"}
                  {item.category === "guide" && "📚"}
                  {item.category === "comparison" && "📊"}
                  {item.category === "other" && "🎁"}
                </span>
              </div>
              <div className={s.content}>
                <h3 className={s.itemTitle}>{item.title}</h3>
                <p className={s.description}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}