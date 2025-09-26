import React from "react";
import s from "@/app/best/layout.module.css";
import { WEIGHTS, EVALUATION_CRITERIA } from "@/lib/evaluation";

const criterionDescriptions = {
  cost: "スプレッド/手数料/スワップの総額。",
  reliability: "ティック密度/約定の安定（混雑時含む）。",
  app: "視認性/操作導線/反応速度。",
};

export default function EvaluationCriteria() {
  return (
    <section className={s.section} id="eval" data-section>
      <h2>評価基準</h2>
      <p>
        各下位指標は0-5。総合は加重平均で算出。主要ペアの提示・約定・UI・導線の実用性を重視。
      </p>
      <ul className={s.bullets}>
        {EVALUATION_CRITERIA.map((criterion) => (
          <li key={criterion.key}>
            <strong>{criterion.label}</strong>…
            {criterionDescriptions[criterion.key]}
          </li>
        ))}
      </ul>
      <div className={s.callout}>
        総合スコア = {(WEIGHTS.cost * 100).toFixed(0)}%×コスト +{" "}
        {(WEIGHTS.reliability * 100).toFixed(0)}%×信頼性 +{" "}
        {(WEIGHTS.app * 100).toFixed(0)}%×アプリ（各0–5）
      </div>
    </section>
  );
}
