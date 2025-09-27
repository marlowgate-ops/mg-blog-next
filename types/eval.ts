// Evaluation criteria types
export interface EvaluationWeights {
  cost: number;
  reliability: number;
  app: number;
  spread: number;
}

export interface BadgeDefinition {
  minScore: number;
  label: string;
  description?: string;
}

export interface CategoryDefinition {
  label: string;
  description?: string;
  weight: number;
}

export interface EvaluationCriteria {
  $schema?: string;
  version: string;
  lastUpdated?: string;
  weights: EvaluationWeights;
  badges?: Record<string, BadgeDefinition>;
  categories?: Record<string, CategoryDefinition>;
}

// Runtime validation helpers
export type EvaluationWeightKeys = keyof EvaluationWeights;

export interface BrokerScores {
  cost: number;
  reliability: number;
  app: number;
  spread: number;
  total?: number;
}

export interface EvaluationResult {
  scores: BrokerScores;
  badges: string[];
  rank?: number;
}