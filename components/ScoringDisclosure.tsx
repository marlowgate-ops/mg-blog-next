"use client";

import React, { useState } from "react";
import { getEvaluationMeta } from "@/lib/evaluation";
import s from "./ScoringDisclosure.module.css";

interface ScoringDisclosureProps {
  pageSlug?: string;
}

export default function ScoringDisclosure({ pageSlug }: ScoringDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const meta = getEvaluationMeta(pageSlug);

  return (
    <div className={s.disclosure}>
      <button
        className={s.toggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="scoring-details"
      >
        <span className={s.icon} aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
        <span>評価基準について</span>
      </button>
      
      {isOpen && (
        <div id="scoring-details" className={s.content}>
          <div className={s.section}>
            <h4>評価ウェイト</h4>
            <ul className={s.weightList}>
              {Object.entries(meta.weights).map(([key, weight]) => {
                const categoryInfo = meta.categories?.[key as keyof typeof meta.categories];
                return (
                  <li key={key} className={s.weightItem}>
                    <span className={s.weightLabel}>
                      {categoryInfo?.label || key}
                    </span>
                    <span className={s.weightValue}>
                      {(weight * 100).toFixed(0)}%
                    </span>
                    {categoryInfo?.description && (
                      <span className={s.weightDesc}>
                        {categoryInfo.description}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {meta.badges && Object.keys(meta.badges).length > 0 && (
            <div className={s.section}>
              <h4>バッジ基準</h4>
              <ul className={s.badgeList}>
                {Object.entries(meta.badges).map(([key, badge]) => (
                  <li key={key} className={s.badgeItem}>
                    <span className={s.badgeLabel}>{badge.label}</span>
                    <span className={s.badgeThreshold}>
                      {badge.minScore}/5以上
                    </span>
                    <span className={s.badgeDesc}>{badge.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={s.footer}>
            <p className={s.version}>
              評価基準バージョン: {meta.version} 
              (更新日: {meta.lastUpdated})
            </p>
            <p className={s.editLink}>
              <a href="/data/eval/README.md" target="_blank" rel="noopener">
                評価基準の編集ガイド →
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}