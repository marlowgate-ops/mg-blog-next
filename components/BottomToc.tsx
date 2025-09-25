import React from "react";
import s from "@/app/best/layout.module.css";

const items = [
  { href: "#ranking", label: "おすすめランキング" },
  { href: "#compare", label: "スペック比較" },
  { href: "#eval", label: "評価基準" },
  { href: "#how-to-choose", label: "選び方" },
  { href: "#app-ux", label: "アプリ" },
  { href: "#cost-opt", label: "コスト" },
  { href: "#faq", label: "FAQ" },
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