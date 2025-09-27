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
    icon: "🏆",
    title: "総合ランキング",
    description: "使いやすさ重視の完全評価版",
    href: "/best/forex-brokers-jp",
    category: "compare"
  },
  {
    icon: "📊",
    title: "DMM証券レビュー",
    description: "国内最大手の実際の使用感",
    href: "/reviews/dmm",
    category: "reviews"
  },
  {
    icon: "💰", 
    title: "低スプレッド比較",
    description: "取引コストを最小化する選択",
    href: "/best/low-spread",
    category: "compare"
  },
  {
    icon: "�",
    title: "アプリ比較",
    description: "モバイル取引の操作性重視",
    href: "/best/app",
    category: "tools"
  },
  {
    icon: "�️",
    title: "取引ツール",
    description: "チャート分析・自動売買対応",
    href: "/best/tools", 
    category: "tools"
  },
  {
    icon: "🎁",
    title: "キャンペーン一覧",
    description: "口座開設特典・最新情報",
    href: "/best/campaigns",
    category: "guides"
  },
  {
    icon: "⚖️",
    title: "比較カテゴリ",
    description: "目的別の業者選択ナビ",
    href: "/compare",
    category: "compare"
  },
  {
    icon: "📚",
    title: "利用規約",
    description: "サイト利用時の注意事項",
    href: "/disclaimer",
    category: "guides"
  },
  {
    icon: "🔍",
    title: "検索機能",
    description: "キーワードでコンテンツ検索",
    href: "/search",
    category: "tools"
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