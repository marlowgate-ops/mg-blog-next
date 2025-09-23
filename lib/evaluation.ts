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
}
