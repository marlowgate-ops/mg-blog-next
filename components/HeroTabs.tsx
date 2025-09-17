"use client";
import React from "react";
import styles from "./HeroTabs.module.css";

type Tab = { key: string; label: string; description: string };

const TABS: Tab[] = [
  { key: "all", label: "総合", description: "総合評価のおすすめ" },
  { key: "spread", label: "低スプレッド", description: "取引コストを重視" },
  { key: "fee", label: "手数料重視", description: "手数料体系の明瞭さ" },
  { key: "app", label: "アプリ重視", description: "使いやすい取引アプリ" },
];

export default function HeroTabs({ onChange }: { onChange?: (key: string)=>void }) {
  const [active, setActive] = React.useState<string>("all");
  return (
    <div className={styles.wrap}>
      <div className={styles.prBadge} aria-label="このページには広告が含まれます">PR</div>
      <h1 className={styles.h1}>【2025年版】国内向けおすすめFX・CFD業者ランキング</h1>
      <p className={styles.lead}>
        初心者〜中級まで“使いやすさ”と“実用性”を重視。国内サービス中心に、スプレッド/手数料、約定、入出金、サポートを総合評価。
      </p>
      <div className={styles.tabs} role="tablist" aria-label="用途別タブ">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            className={active === t.key ? styles.tabActive : styles.tab}
            onClick={() => { setActive(t.key); onChange?.(t.key); }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className={styles.tabDesc}>{TABS.find(x=>x.key===active)?.description}</p>
    </div>
  );
}
