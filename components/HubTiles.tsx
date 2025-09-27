import React from "react";
import Link from "next/link";
import s from "./HubTiles.module.css";

interface HubTile {
  icon: string;
  title: string;
  description: string;
  href: string;
  category: "reviews" | "compare" | "tools" | "guides";
}

const hubTiles: HubTile[] = [
  {
    icon: "📊",
    title: "業者レビュー",
    description: "実際の利用体験と詳細分析",
    href: "/reviews/dmm",
    category: "reviews"
  },
  {
    icon: "⚖️", 
    title: "詳細比較",
    description: "スプレッド・手数料の徹底比較",
    href: "/best/low-spread",
    category: "compare"
  },
  {
    icon: "🛠️",
    title: "取引ツール",
    description: "MT4/MT5対応業者一覧",
    href: "/best/tools", 
    category: "tools"
  },
  {
    icon: "📱",
    title: "アプリ比較",
    description: "操作性・機能性で選ぶ",
    href: "/best/app",
    category: "tools"
  },
  {
    icon: "💰",
    title: "キャンペーン",
    description: "口座開設特典・キャッシュバック",
    href: "/best/campaigns",
    category: "guides"
  },
  {
    icon: "📚",
    title: "選び方ガイド",
    description: "初心者向け業者選定のコツ",
    href: "#how-to-choose",
    category: "guides"
  }
];

export default function HubTiles() {
  return (
    <section className={s.hubSection} aria-label="関連コンテンツ">
      <div className={s.container}>
        <h2 className={s.sectionTitle}>関連情報</h2>
        <div className={s.tilesGrid}>
          {hubTiles.map((tile, index) => (
            <Link
              key={index}
              href={tile.href}
              className={`${s.tile} ${s[`category-${tile.category}`]}`}
            >
              <div className={s.tileIcon}>{tile.icon}</div>
              <div className={s.tileContent}>
                <h3 className={s.tileTitle}>{tile.title}</h3>
                <p className={s.tileDescription}>{tile.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}