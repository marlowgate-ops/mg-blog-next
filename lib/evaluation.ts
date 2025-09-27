// lib/evaluation.ts
import { EvaluationCriteria, EvaluationWeights, BrokerScores } from "@/types/eval";
import criteriaData from "@/data/eval/criteria.json";

export type BrokerRow = {
  cost?: number; // 0..5
  reliability?: number; // 0..5
  app?: number; // 0..5
  spread?: number; // 0..5
};

// Deep merge helper for partial overrides
function deepMerge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  
  for (const key in override) {
    const overrideValue = override[key];
    if (overrideValue !== undefined) {
      if (
        typeof overrideValue === 'object' &&
        overrideValue !== null &&
        !Array.isArray(overrideValue) &&
        typeof base[key] === 'object' &&
        base[key] !== null &&
        !Array.isArray(base[key])
      ) {
        (result as any)[key] = deepMerge(base[key], overrideValue);
      } else {
        (result as any)[key] = overrideValue;
      }
    }
  }
  
  return result;
}

// Load criteria with optional per-page overrides
function loadCriteria(pageSlug?: string): EvaluationCriteria {
  let criteria = criteriaData as EvaluationCriteria;
  
  // Apply page-specific overrides if available
  if (pageSlug) {
    try {
      const overrideData = require(`@/data/eval/overrides/${pageSlug}.json`);
      criteria = deepMerge(criteria, overrideData);
    } catch (error) {
      // Override file doesn't exist or has errors, use base criteria
      if (process.env.NODE_ENV === "development") {
        console.log(`No overrides found for page: ${pageSlug}`);
      }
    }
  }
  
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

export function scoreBroker(row: BrokerRow, pageSlug?: string): number {
  const criteria = pageSlug ? loadCriteria(pageSlug) : CRITERIA;
  const weights = criteria.weights || FALLBACK_WEIGHTS;
  
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
export function getBrokerBadges(score: number, pageSlug?: string): string[] {
  const criteria = pageSlug ? loadCriteria(pageSlug) : CRITERIA;
  const badges: string[] = [];
  
  if (criteria.badges) {
    for (const [badgeKey, badge] of Object.entries(criteria.badges)) {
      if (score >= badge.minScore) {
        badges.push(badgeKey);
      }
    }
  }
  
  return badges;
}

/** Get evaluation criteria metadata */
export function getEvaluationMeta(pageSlug?: string) {
  const criteria = pageSlug ? loadCriteria(pageSlug) : CRITERIA;
  return {
    version: criteria.version,
    lastUpdated: criteria.lastUpdated,
    weights: criteria.weights,
    categories: criteria.categories,
    badges: criteria.badges,
  };
}
