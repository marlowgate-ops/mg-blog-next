import React from "react";

const items = [
  { href: "#ranking", label: "用途別おすすめ / 総合" },
  { href: "#compare", label: "主要スペック比較" },
  { href: "#eval", label: "評価基準" },
  { href: "#how-to-choose", label: "選び方" },
  { href: "#app-ux", label: "アプリの使い勝手" },
  { href: "#cost-opt", label: "コスト最適化" },
  { href: "#faq", label: "よくある質問" },
];

export default function TocCard() {
  return (
    <section className="tocCard" aria-label="このページでわかること">
      <h3>このページでわかること</h3>
      <ul>
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href} aria-label={i.label}>{i.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
