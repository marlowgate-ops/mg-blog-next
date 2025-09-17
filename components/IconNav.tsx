"use client";
import React from "react";
type Item = { href: string; label: string; emoji: string; note?: string };
const items: Item[] = [
  { href: "#rank-all", label: "総合", emoji: "🏆" },
  { href: "#low-spread", label: "低スプレッド", emoji: "💹" },
  { href: "#cost", label: "手数料比較", emoji: "💴" },
  { href: "#apps", label: "アプリ比較", emoji: "📱" },
  { href: "#tools", label: "取引ツール", emoji: "🧰" },
  { href: "#swap", label: "スワップ", emoji: "♻️" },
  { href: "#campaign", label: "キャンペーン", emoji: "🎁" },
  { href: "#popular", label: "人気", emoji: "📈" },
];
export default function IconNav() {
  return (
    <nav className="mg-iconnav" aria-label="比較メニュー">
      {items.map((x) => (
        <a key={x.href} className="mg-iconnav-item" href={x.href}>
          <span className="mg-iconnav-emoji" aria-hidden>{x.emoji}</span>
          <span>{x.label}</span>
        </a>
      ))}
      <style jsx global>{`
        .mg-iconnav { display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; margin-top: 12px; }
        .mg-iconnav-item {
          display: flex; align-items: center; gap: 6px;
          background: #fff; border: 1px solid #e7e8ea; border-radius: 10px;
          padding: 8px 10px; text-decoration: none; color: #1f2937; font-size: 13px;
        }
        .mg-iconnav-item:hover { background: #f9fafb; }
        .mg-iconnav-emoji { font-size: 16px; }
        @media (max-width: 1100px){ .mg-iconnav { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 640px){ .mg-iconnav { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </nav>
  );
}
