import React from "react";
import { getEvaluationMeta } from "@/lib/evaluation";
import s from "./EvaluationRules.module.css";

interface EvaluationRulesProps {
  pageSlug?: string;
}

export default function EvaluationRules({ pageSlug }: EvaluationRulesProps) {
  const meta = getEvaluationMeta(pageSlug);

  return (
    <section className={s.evaluationSection} id="evaluation-rules" aria-labelledby="evaluation-title">
      <div className={s.container}>
        <h2 id="evaluation-title" className={s.sectionTitle}>
          <span className={s.titleIcon}>📊</span>
          評価基準
        </h2>
        
        <div className={s.content}>
          <div className={s.overview}>
            <p className={s.description}>
              当サイトでは、以下の4つの観点から各FX・CFD業者を総合評価しています。
              実際の利用者の視点に立ち、使いやすさと実用性を重視した評価基準を設定しています。
            </p>
          </div>

          <div className={s.weightsTable}>
            <h3 className={s.subsectionTitle}>評価ウェイト</h3>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>評価項目</th>
                  <th>ウェイト</th>
                  <th>重視ポイント</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(meta.weights).map(([key, weight]) => {
                  const categoryInfo = meta.categories?.[key as keyof typeof meta.categories];
                  return (
                    <tr key={key}>
                      <td className={s.categoryName}>
                        {categoryInfo?.label || key}
                      </td>
                      <td className={s.weightValue}>
                        {(weight * 100).toFixed(0)}%
                      </td>
                      <td className={s.categoryDesc}>
                        {categoryInfo?.description || '詳細評価基準'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={s.criteriaList}>
            <h3 className={s.subsectionTitle}>評価観点</h3>
            <ul className={s.criteria}>
              <li>
                <strong>コスト効率性：</strong>
                スプレッド、手数料、入出金コストの総合評価
              </li>
              <li>
                <strong>約定・配信の安定性：</strong>
                レート配信頻度、約定スピード、スリッページ耐性
              </li>
              <li>
                <strong>取引アプリ・ツール：</strong>
                操作性、機能充実度、分析ツールの使いやすさ
              </li>
              <li>
                <strong>サポート・信頼性：</strong>
                入出金の速度、顧客サポート品質、企業の安定性
              </li>
            </ul>
          </div>

          {meta.badges && Object.keys(meta.badges).length > 0 && (
            <div className={s.badgesSection}>
              <h3 className={s.subsectionTitle}>バッジ基準</h3>
              <div className={s.badgesList}>
                {Object.entries(meta.badges).map(([key, badge]) => (
                  <div key={key} className={s.badgeRule}>
                    <span className={s.badgeLabel}>{badge.label}</span>
                    <span className={s.badgeThreshold}>
                      {badge.minScore}/5以上
                    </span>
                    <span className={s.badgeDesc}>{badge.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={s.footer}>
            <p className={s.version}>
              評価基準バージョン: {meta.version} (更新日: {meta.lastUpdated})
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}