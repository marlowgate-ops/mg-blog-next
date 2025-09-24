import React from "react";
import s from "@/app/best/layout.module.css";

export default function TocCard() {
  const tocItems = [
    { href: "#ranking", label: "総合ランキング", ariaLabel: "総合ランキングセクションへ移動" },
    { href: "#compare", label: "主要スペック比較", ariaLabel: "主要スペック比較表セクションへ移動" },
    { href: "#how-to-choose", label: "低スプレッドの選び方", ariaLabel: "低スプレッドの選び方セクションへ移動" },
    { href: "#app-ux", label: "アプリの使い勝手", ariaLabel: "アプリの使い勝手セクションへ移動" },
    { href: "#cost-opt", label: "コスト最適化の考え方", ariaLabel: "コスト最適化の考え方セクションへ移動" },
    { href: "#faq", label: "よくある質問", ariaLabel: "よくある質問セクションへ移動" },
  ];

  return (
    <div className={s.tocCard}>
      <h3 className={s.tocTitle}>このページでわかること</h3>
      <ul className={s.tocList}>
        {tocItems.map((item) => (
          <li key={item.href} className={s.tocItem}>
            <a href={item.href} className={s.tocLink} aria-label={item.ariaLabel}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
