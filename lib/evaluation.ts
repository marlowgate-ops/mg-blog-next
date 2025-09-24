// lib/evaluation.ts
export type BrokerRow = {
  cost?: number;         // 0..5
  reliability?: number;  // 0..5
  app?: number;          // 0..5
};

export const WEIGHTS = {
  cost: 0.35,
  reliability: 0.35,
  app: 0.30,
} as const;

export function scoreBroker(row: BrokerRow): number {
  const cost = row.cost ?? 0;
  const reliability = row.reliability ?? 0;
  const app = row.app ?? 0;
  const s =
    cost * WEIGHTS.cost +
    reliability * WEIGHTS.reliability +
    app * WEIGHTS.app;
  // round to 1 decimal (e.g., 4.3)
  return Math.round(s * 10) / 10;
}

/** For UI: show weights & labels */
export const EVALUATION_CRITERIA = [
  { key: "cost",        label: "取引コスト",     weight: WEIGHTS.cost },
  { key: "reliability", label: "信頼性・約定力", weight: WEIGHTS.reliability },
  { key: "app",         label: "アプリの使いやすさ", weight: WEIGHTS.app },
] as const;

export type CriterionKey = typeof EVALUATION_CRITERIA[number]["key"];