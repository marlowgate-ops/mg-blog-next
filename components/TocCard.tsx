import React from "react";
import s from "@/app/best/layout.module.css";

export default function TocCard() {
  const tocItems = [
    { href: "#ranking", label: "用途別おすすめ" },
    { href: "#compare", label: "比較表" },
    { href: "#eval", label: "評価基準" },
    { href: "#how-to-choose", label: "選び方" },
    { href: "#faq", label: "よくある質問" },
  ];

  return (
    <div className={s.tocCard}>
      <h3 className={s.tocTitle}>このページでわかること</h3>
      <ul className={s.tocList}>
        {tocItems.map((item) => (
          <li key={item.href} className={s.tocItem}>
            <a href={item.href} className={s.tocLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
