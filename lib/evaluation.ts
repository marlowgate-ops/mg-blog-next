export const WEIGHTS = { total: { cost: 0.35, execution: 0.35, app: 0.30 } } as const;
export const EVAL_NOTE =
  "各下位指標は0-5。総合は加重平均で算出。主要ペアの提示・約定・UI・導線の実用性を重視。";
export function formatFormula(): string {
  const w = WEIGHTS.total;
  const round = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
  return `総合スコア = ${round(w.cost)}×コスト + ${round(w.execution)}×約定 + ${round(w.app)}×アプリ（各0–5）`;
}
