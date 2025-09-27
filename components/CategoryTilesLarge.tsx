"use client";
import React from "react";
import Link from "next/link";
import s from "./CategoryTilesLarge.module.css";

interface HubTile {
  href: string;
  label: string;
  description: string;
  category?: 'ranking' | 'comparison' | 'guide' | 'tool';
}

const hubTiles: HubTile[] = [
  // Row 1 - Core rankings
  { href: "#ranking", label: "総合ランキング", description: "使いやすさ重視の総合評価", category: 'ranking' },
  { href: "#compare", label: "スペック比較", description: "手数料・機能の詳細比較", category: 'comparison' },
  { href: "#eval", label: "評価基準", description: "ランキングの根拠と方針", category: 'guide' },
  { href: "#how-to-choose", label: "選び方", description: "低スプレッド業者の選定ポイント", category: 'guide' },
  
  // Row 2 - Specialized views  
  { href: "/best/low-spread", label: "低スプレッド", description: "コスト重視で選ぶ", category: 'ranking' },
  { href: "/best/app", label: "アプリ重視", description: "操作性・反応速度で選ぶ", category: 'ranking' },
  { href: "/best/tools", label: "取引ツール", description: "PC環境・機能面で選ぶ", category: 'tool' },
  { href: "/best/campaigns", label: "キャンペーン", description: "口座開設特典一覧", category: 'tool' },
  
  // Row 3 - User guidance
  { href: "#app-ux", label: "アプリUX", description: "取引アプリの操作性", category: 'guide' },
  { href: "#cost-opt", label: "コスト最適化", description: "複数口座活用の戦略", category: 'guide' },
  { href: "#faq", label: "よくある質問", description: "初心者向けQ&A", category: 'guide' },
  { href: "#reviews", label: "口コミ・評価", description: "ユーザーの実際の声", category: 'tool' },
];

export default function CategoryTilesLarge() {
  return (
    <section className={s.hubSection} aria-label="サイト内ナビゲーション">
      <div className={s.hubGrid}>
        {hubTiles.map((tile, index) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`${s.hubTile} ${s[tile.category || 'guide']}`}
            aria-describedby={`tile-desc-${index}`}
          >
            <div className={s.tileContent}>
              <h3 className={s.tileLabel}>{tile.label}</h3>
              <p id={`tile-desc-${index}`} className={s.tileDescription}>
                {tile.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}