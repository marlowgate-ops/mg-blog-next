/**
 * Topic synonym mapping for search functionality
 * Maps search terms to topic hub IDs for improved discovery
 */

export interface TopicSynonym {
  topic: string;
  synonyms: string[];
  weight: number; // Higher weight = stronger match
}

export const topicSynonyms: TopicSynonym[] = [
  {
    topic: 'fx-basics',
    synonyms: [
      'forex', 'FX', '外国為替', '外為', 'foreign exchange',
      'currency trading', 'currency pair', '通貨ペア',
      'spread', 'スプレッド', 'pip', 'ピップ', 'leverage', 'レバレッジ',
      'margin', 'マージン', '証拠金', 'lot', 'ロット'
    ],
    weight: 1.0
  },
  {
    topic: 'risk-management',
    synonyms: [
      'リスク管理', 'リスクマネジメント', 'risk management',
      'position sizing', 'ポジションサイジング', 'stop loss', 'ストップロス',
      'take profit', 'テイクプロフィット', 'drawdown', 'ドローダウン',
      'portfolio management', 'ポートフォリオ管理', 'diversification', '分散投資',
      'risk reward', 'リスクリワード', 'money management', '資金管理'
    ],
    weight: 1.0
  },
  {
    topic: 'insurance-basics',
    synonyms: [
      'insurance', '保険', 'life insurance', '生命保険',
      'auto insurance', '自動車保険', 'medical insurance', '医療保険',
      'premium', '保険料', 'deductible', '免責', 'coverage', '補償',
      'claim', '請求', 'policy', '保険証券', 'beneficiary', '受益者'
    ],
    weight: 1.0
  },
  {
    topic: 'trading-strategies',
    synonyms: [
      'trading strategy', '取引戦略', 'トレード戦略', 'scalping', 'スキャルピング',
      'day trading', 'デイトレード', 'swing trading', 'スイングトレード',
      'position trading', 'ポジショントレード', 'technical analysis', 'テクニカル分析',
      'fundamental analysis', 'ファンダメンタル分析', 'chart pattern', 'チャートパターン'
    ],
    weight: 1.0
  },
  {
    topic: 'investment-basics',
    synonyms: [
      'investment', '投資', '投資の基礎', 'investing basics',
      'stocks', '株式', 'bonds', '債券', 'ETF', 'mutual funds', '投資信託',
      'portfolio', 'ポートフォリオ', 'asset allocation', '資産配分',
      'dividend', '配当', 'compound interest', '複利'
    ],
    weight: 1.0
  },
  {
    topic: 'broker-selection',
    synonyms: [
      'broker', 'ブローカー', '業者選び', 'broker comparison', '業者比較',
      'broker review', 'ブローカーレビュー', 'trading platform', '取引プラットフォーム',
      'regulation', '規制', 'safety', '安全性', 'fees', '手数料',
      'execution', '約定', 'customer support', 'カスタマーサポート'
    ],
    weight: 1.0
  }
];

/**
 * Find matching topics for a search query
 */
export function findTopicsBySearch(query: string): Array<{ topic: string; relevance: number }> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const matches: Array<{ topic: string; relevance: number }> = [];

  for (const synonym of topicSynonyms) {
    let relevance = 0;

    // Check exact topic match
    if (synonym.topic.toLowerCase().includes(normalizedQuery)) {
      relevance += 2.0 * synonym.weight;
    }

    // Check synonym matches
    for (const syn of synonym.synonyms) {
      const normalizedSyn = syn.toLowerCase();
      
      if (normalizedSyn === normalizedQuery) {
        // Exact match
        relevance += 1.5 * synonym.weight;
      } else if (normalizedSyn.includes(normalizedQuery) || normalizedQuery.includes(normalizedSyn)) {
        // Partial match
        relevance += 1.0 * synonym.weight;
      }
    }

    if (relevance > 0) {
      matches.push({ topic: synonym.topic, relevance });
    }
  }

  // Sort by relevance (highest first) and return unique topics
  return matches
    .sort((a, b) => b.relevance - a.relevance)
    .filter((match, index, array) => 
      array.findIndex(m => m.topic === match.topic) === index
    );
}

/**
 * Get all synonyms for a specific topic
 */
export function getSynonymsForTopic(topicId: string): string[] {
  const synonym = topicSynonyms.find(s => s.topic === topicId);
  return synonym ? synonym.synonyms : [];
}

/**
 * Get all available topic IDs
 */
export function getAllTopicIds(): string[] {
  return topicSynonyms.map(s => s.topic);
}