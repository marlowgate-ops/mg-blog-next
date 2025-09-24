<<<<<<< HEAD
export const WEIGHTS = { total: { cost: 0.35, execution: 0.35, app: 0.30 } } as const;
export const EVAL_NOTE =
  "各下位指標は0-5。総合は加重平均で算出。主要ペアの提示・約定・UI・導線の実用性を重視。";
export function formatFormula(): string {
  const w = WEIGHTS.total;
  const round = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
  return `総合スコア = ${round(w.cost)}×コスト + ${round(w.execution)}×約定 + ${round(w.app)}×アプリ（各0–5）`;
=======
import evaluationData from "@/data/evaluation.json";

export interface BrokerRow {
  cost?: number;
  execution?: number;
  app?: number;
  [key: string]: any;
}

export interface EvaluationWeights {
  約定: number;
  コスト: number;
  アプリ: number;
}

export interface EvaluationData {
  weights: EvaluationWeights;
  notes: string;
}

/**
 * Calculate total score based on evaluation weights
 */
export function getTotalScore(row: BrokerRow): number {
  const weights = evaluationData.weights;

  const costScore = row.cost || 0;
  const executionScore = row.execution || 0;
  const appScore = row.app || 0;

  return (
    costScore * weights.コスト +
    executionScore * weights.約定 +
    appScore * weights.アプリ
  );
}

/**
 * Get evaluation weights for display
 */
export function getEvaluationWeights(): EvaluationWeights {
  return evaluationData.weights;
}

/**
 * Get evaluation notes
 */
export function getEvaluationNotes(): string {
  return evaluationData.notes;
}

/**
 * Format weight as percentage
 */
export function formatWeight(weight: number): string {
  return `${Math.round(weight * 100)}%`;
>>>>>>> origin/main
}
