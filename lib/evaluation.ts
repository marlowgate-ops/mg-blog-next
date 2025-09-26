// lib/evaluation.ts
import { EvaluationCriteria, EvaluationWeights, BrokerScores } from "@/types/eval";
import criteriaData from "@/data/eval/criteria.json";

export type BrokerRow = {
  cost?: number; // 0..5
  reliability?: number; // 0..5
  app?: number; // 0..5
  spread?: number; // 0..5
};

// Load and validate criteria from JSON
function loadCriteria(): EvaluationCriteria {
  const criteria = criteriaData as EvaluationCriteria;
  
  // Validate weights sum approximately to 1.0
  const weightSum = Object.values(criteria.weights).reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(weightSum - 1.0) > 0.01) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Evaluation weights sum to ${weightSum}, expected 1.0`);
    }
  }
  
  return criteria;
}

const CRITERIA = loadCriteria();

// Export weights from loaded criteria
export const WEIGHTS: EvaluationWeights = CRITERIA.weights;

// Fallback weights if JSON fails to load
const FALLBACK_WEIGHTS: EvaluationWeights = {
  cost: 0.35,
  reliability: 0.25,
  app: 0.20,
  spread: 0.20,
};

export function scoreBroker(row: BrokerRow): number {
  const weights = WEIGHTS || FALLBACK_WEIGHTS;
  
  const cost = row.cost ?? 0;
  const reliability = row.reliability ?? 0;
  const app = row.app ?? 0;
  const spread = row.spread ?? 0;
  
  const s = cost * weights.cost + 
           reliability * weights.reliability + 
           app * weights.app + 
           spread * weights.spread;
  
  // round to 1 decimal (e.g., 4.3)
  return Math.round(s * 10) / 10;
}

/** For UI: show weights & labels */
export const EVALUATION_CRITERIA = [
  { key: "cost" as const, label: "取引コスト", weight: WEIGHTS.cost },
  { key: "reliability" as const, label: "信頼性・約定力", weight: WEIGHTS.reliability },
  { key: "app" as const, label: "アプリの使いやすさ", weight: WEIGHTS.app },
  { key: "spread" as const, label: "スプレッド", weight: WEIGHTS.spread },
] as const;

export type CriterionKey = (typeof EVALUATION_CRITERIA)[number]["key"];

/** Get badges for a broker based on score */
export function getBrokerBadges(score: number): string[] {
  const badges: string[] = [];
  
  if (CRITERIA.badges) {
    for (const [badgeKey, badge] of Object.entries(CRITERIA.badges)) {
      if (score >= badge.minScore) {
        badges.push(badgeKey);
      }
    }
  }
  
  return badges;
}

/** Get evaluation criteria metadata */
export function getEvaluationMeta() {
  return {
    version: CRITERIA.version,
    lastUpdated: CRITERIA.lastUpdated,
    weights: CRITERIA.weights,
    categories: CRITERIA.categories,
    badges: CRITERIA.badges,
  };
}
