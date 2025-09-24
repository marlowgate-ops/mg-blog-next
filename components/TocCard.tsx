import React from "react";
import s from '../app/best/layout.module.css';

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
    <section className={s.tocCard} aria-label="目次">
      <h3>目次</h3>
      <ol className={s.tocList}>
        {items.map((item, index) => (
          <li key={item.href} className={s.tocItem}>
            <a href={item.href} className={s.tocLink} aria-label={item.label}>
              <span className={s.tocNumber}>{index + 1}</span>
              <span className={s.tocLabel}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
