import { BrokerData, BrokerScoringWeights, DEFAULT_SCORING_WEIGHTS } from '@/content_source/brokers/brokers.schema';
import brokers from '@/content_source/brokers/brokers.json';

/**
 * Broker Scoring Service
 * 
 * Provides transparent and consistent scoring methodology for broker comparisons.
 * All weights and calculations are documented to avoid magic numbers in components.
 */

/**
 * Calculate the total weighted score for a broker
 * 
 * @param scores Individual category scores (1-5 scale)
 * @param weights Scoring weights (should sum to 1.0)
 * @returns Weighted average score rounded to 1 decimal place
 */
export function calculateTotalScore(
  scores: BrokerData['scores'], 
  weights: BrokerScoringWeights = DEFAULT_SCORING_WEIGHTS
): number {
  const weightedSum = 
    scores.cost * weights.cost +
    scores.platform * weights.platform +
    scores.execution * weights.execution +
    scores.support * weights.support +
    scores.education * weights.education;
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Get the average spread for a broker across major currency pairs
 * 
 * @param spreads Spread data by currency pair
 * @param pairs Optional array of pairs to include (defaults to major pairs)
 * @returns Average spread in pips
 */
export function getAverageSpread(
  spreads: BrokerData['spread_typical'], 
  pairs: string[] = ['USDJPY', 'EURUSD', 'GBPJPY', 'AUDJPY', 'EURJPY']
): number {
  const availablePairs = pairs.filter(pair => spreads[pair] !== undefined);
  if (availablePairs.length === 0) return 0;
  
  const totalSpread = availablePairs.reduce((sum, pair) => sum + spreads[pair], 0);
  return Math.round((totalSpread / availablePairs.length) * 100) / 100;
}

/**
 * Score interpretation for UI display
 */
export const SCORE_LABELS = {
  5.0: { label: '優秀', color: '#059669', description: '業界トップクラス' },
  4.5: { label: '良好', color: '#0891b2', description: '平均を大きく上回る' },
  4.0: { label: '標準+', color: '#0284c7', description: '平均を上回る' },
  3.5: { label: '標準', color: '#6b7280', description: '業界平均レベル' },
  3.0: { label: '改善余地', color: '#f59e0b', description: '平均を下回る' },
  2.5: { label: '要注意', color: '#ef4444', description: '大きく平均を下回る' }
} as const;

/**
 * Get the appropriate label for a score
 * 
 * @param score Numerical score (1-5 scale)
 * @returns Score label with color and description
 */
export function getScoreLabel(score: number) {
  const roundedScore = Math.round(score * 2) / 2; // Round to nearest 0.5
  const key = Math.min(5.0, Math.max(2.5, roundedScore)) as keyof typeof SCORE_LABELS;
  return SCORE_LABELS[key];
}

/**
 * Scoring methodology documentation
 */
export const SCORING_METHODOLOGY = {
  weights: DEFAULT_SCORING_WEIGHTS,
  descriptions: {
    cost: {
      title: 'コスト評価',
      description: 'スプレッド、手数料、スワップポイントの総合評価',
      factors: ['スプレッドの狭さ', '取引手数料', '入出金手数料', 'スワップポイント', '隠れコストの有無']
    },
    platform: {
      title: 'プラットフォーム評価', 
      description: '取引ツールの機能性と使いやすさ',
      factors: ['操作性', 'チャート機能', '注文機能', 'モバイル対応', '安定性']
    },
    execution: {
      title: '約定力評価',
      description: '注文執行の速度と正確性',
      factors: ['約定スピード', 'スリッページ', '約定拒否率', 'サーバー安定性', 'リクオート頻度']
    },
    support: {
      title: 'サポート評価',
      description: '顧客サポートの品質と対応力',
      factors: ['対応時間', '問い合わせ手段', '回答品質', '日本語対応', 'FAQ充実度']
    },
    education: {
      title: '教育コンテンツ評価',
      description: '学習リソースと情報提供の充実度',
      factors: ['セミナー開催', 'マーケット情報', '初心者向け教材', 'ツール解説', 'アナリストレポート']
    }
  }
};

/**
 * Filter brokers based on criteria
 * 
 * @param brokers Array of broker data
 * @param filters Filter criteria
 * @returns Filtered broker array
 */
export function filterBrokers(
  brokers: BrokerData[], 
  filters: {
    platforms?: string[];
    regulator?: string[];
    leverage_min?: number;
    leverage_max?: number;
    min_deposit_max?: number;
    search?: string;
  }
): BrokerData[] {
  return brokers.filter(broker => {
    // Platform filter
    if (filters.platforms?.length) {
      const hasMatchingPlatform = filters.platforms.some(platform =>
        broker.platforms.some(p => p.toLowerCase().includes(platform.toLowerCase()))
      );
      if (!hasMatchingPlatform) return false;
    }
    
    // Regulator filter
    if (filters.regulator?.length) {
      const hasMatchingRegulator = filters.regulator.some(reg =>
        broker.regulator.includes(reg)
      );
      if (!hasMatchingRegulator) return false;
    }
    
    // Leverage range filter
    if (filters.leverage_min && broker.leverage_max < filters.leverage_min) return false;
    if (filters.leverage_max && broker.leverage_max > filters.leverage_max) return false;
    
    // Minimum deposit filter
    if (filters.min_deposit_max && broker.min_deposit > filters.min_deposit_max) return false;
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = `${broker.brand} ${broker.notes}`.toLowerCase();
      if (!searchableText.includes(searchLower)) return false;
    }
    
    return true;
  });
}

/**
 * Sort brokers by specified field and direction
 * 
 * @param brokers Array of broker data
 * @param field Field to sort by
 * @param direction Sort direction
 * @returns Sorted broker array
 */
export function sortBrokers(
  brokers: BrokerData[], 
  field: 'score_total' | 'min_deposit' | 'leverage_max' | 'spread_avg' | 'brand',
  direction: 'asc' | 'desc' = 'desc'
): BrokerData[] {
  return [...brokers].sort((a, b) => {
    let valueA: number | string;
    let valueB: number | string;
    
    switch (field) {
      case 'score_total':
        valueA = a.score_total;
        valueB = b.score_total;
        break;
      case 'min_deposit':
        valueA = a.min_deposit;
        valueB = b.min_deposit;
        break;
      case 'leverage_max':
        valueA = a.leverage_max;
        valueB = b.leverage_max;
        break;
      case 'spread_avg':
        valueA = getAverageSpread(a.spread_typical);
        valueB = getAverageSpread(b.spread_typical);
        break;
      case 'brand':
        valueA = a.brand.toLowerCase();
        valueB = b.brand.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    const numA = valueA as number;
    const numB = valueB as number;
    
    return direction === 'asc' ? numA - numB : numB - numA;
  });
}

/**
 * Get all brokers with calculated scores
 * @returns Array of all brokers with calculated total scores
 */
export function getAllBrokers(): BrokerData[] {
  return brokers.map(broker => ({
    ...broker,
    score_total: calculateTotalScore(broker.scores)
  }))
}