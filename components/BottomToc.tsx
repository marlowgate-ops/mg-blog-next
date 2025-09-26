import React from "react";
import s from "@/app/best/layout.module.css";

const items = [
  { href: "#ranking", label: "総合ランキング" },
  { href: "#compare", label: "スペック比較" },
  { href: "#eval", label: "評価基準" },
  { href: "#how-to-choose", label: "選び方" },
  { href: "#app-ux", label: "アプリUX" },
  { href: "#cost-opt", label: "コスト最適化" },
  { href: "#costs", label: "手数料詳細" },
  { href: "#campaign", label: "キャンペーン" },
  { href: "#reviews", label: "口コミ・評価" },
  { href: "#detail-reviews", label: "詳細レビュー" },
  { href: "#faq", label: "よくある質問" },
  { href: "#poll", label: "投票" },
];

export default function BottomToc() {
  return (
    <nav className={s.bottomToc} aria-label="ページ内リンク">
      <div className={s.container}>
        <h3>このページの他のセクション</h3>
        <div className={s.bottomTocGrid}>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={s.bottomTocLink}
              aria-label={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
