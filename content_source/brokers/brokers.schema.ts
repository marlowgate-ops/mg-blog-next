export interface BrokerData {
  slug: string;
  brand: string;
  country: string;
  regulator: string[];
  min_deposit: number;
  leverage_max: number;
  spread_typical: {
    [pair: string]: number; // e.g., "USDJPY": 0.2, "EURUSD": 0.3
  };
  platforms: string[];
  instruments: string[];
  fees: {
    deposit: number;
    withdrawal: number;
    overnight: number;
  };
  funding: string[]; // e.g., ["bank_transfer", "credit_card", "paypal"]
  notes: string;
  urls: {
    official: string;
    account_open: string;
  };
  scores: {
    cost: number; // 1-5 scale
    platform: number; // 1-5 scale
    execution: number; // 1-5 scale
    support: number; // 1-5 scale
    education: number; // 1-5 scale
  };
  score_total: number; // computed weighted average
}

export interface BrokerScoringWeights {
  cost: number;
  platform: number;
  execution: number;
  support: number;
  education: number;
}

export const DEFAULT_SCORING_WEIGHTS: BrokerScoringWeights = {
  cost: 0.30,      // 30% - Most important for cost-conscious traders
  platform: 0.25,  // 25% - Trading platform quality and features
  execution: 0.20, // 20% - Order execution speed and reliability
  support: 0.15,   // 15% - Customer support quality
  education: 0.10   // 10% - Educational resources and tools
};

export type BrokerSortField = 'score_total' | 'min_deposit' | 'leverage_max' | 'spread_typical' | 'brand';
export type SortDirection = 'asc' | 'desc';

export interface BrokerFilterOptions {
  platforms?: string[];
  regulator?: string[];
  leverage_min?: number;
  leverage_max?: number;
  min_deposit_max?: number;
  search?: string;
}