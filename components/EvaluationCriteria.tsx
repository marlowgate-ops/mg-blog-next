import React from "react";
import s from "@/app/best/layout.module.css";
import { EVAL_NOTE, formatFormula } from "@/lib/evaluation";
export default function EvaluationCriteria() {
  return (
    <section className={s.section} id="eval" data-section>
      <h2>評価基準</h2>
      <p>{EVAL_NOTE}</p>
      <ul className={s.bullets}>
        <li><strong>コスト</strong>…スプレッド/手数料/スワップの総額。</li>
        <li><strong>約定・配信</strong>…ティック密度/約定の安定（混雑時含む）。</li>
        <li><strong>アプリ</strong>…視認性/操作導線/反応速度。</li>
      </ul>
      <div className={s.callout}>{formatFormula()}</div>
    </section>
  );
}