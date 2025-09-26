import React from "react";
import s from "@/app/best/layout.module.css";

const tiles = [
  { href: "#ranking", label: "総合ランキング", icon: "🏆" },
  { href: "#compare", label: "スペック比較", icon: "📊" },
  { href: "#eval", label: "評価基準", icon: "⚖️" },
  { href: "#how-to-choose", label: "選び方", icon: "💡" },
  { href: "#app-ux", label: "アプリUX", icon: "📱" },
  { href: "#cost-opt", label: "コスト最適化", icon: "💰" },
  { href: "#costs", label: "手数料詳細", icon: "💹" },
  { href: "#campaign", label: "キャンペーン", icon: "🎁" },
  { href: "#reviews", label: "口コミ・評価", icon: "⭐" },
  { href: "#detail-reviews", label: "詳細レビュー", icon: "📝" },
  { href: "#faq", label: "よくある質問", icon: "❓" },
  { href: "#poll", label: "投票", icon: "📊" },
];

export default function CategoryTiles() {
  return (
    <section className={s.categoryTiles} aria-label="カテゴリー">
      {tiles.map((tile) => (
        <a key={tile.href} href={tile.href} className={s.categoryTile}>
          <span className={s.tileIcon} aria-hidden="true">
            {tile.icon}
          </span>
          <span className={s.tileLabel}>{tile.label}</span>
        </a>
      ))}
    </section>
  );
}
