/**
 * Topic hub data and utilities
 * Provides content curation and internal linking for topic hubs
 */

import { allPosts } from 'contentlayer/generated';
import { getAllBrokers } from '@/lib/score/brokers';
import { loadInsuranceProducts } from '@/lib/insurance-data';
import { InsuranceProduct } from '@/content_source/insurance/insurance.schema';
import { getSynonymsForTopic } from '@/lib/search/synonyms';

export interface TopicHub {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'forex' | 'investment' | 'insurance' | 'trading' | 'education';
  keywords: string[];
  featured: boolean;
}

export interface CuratedContent {
  guides: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    featured: boolean;
  }>;
  tools: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    featured: boolean;
  }>;
  brokers: Array<{
    id: string;
    brand: string;
    description: string;
    url: string;
    score: number;
    featured: boolean;
  }>;
  insurance: Array<{
    id: string;
    company: string;
    category: string;
    description: string;
    url: string;
    rating: number;
    featured: boolean;
  }>;
  posts: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    featured: boolean;
  }>;
}

export const topicHubs: TopicHub[] = [
  {
    id: 'fx-basics',
    title: 'FX・外国為替の基礎',
    description: 'FX取引の基本から応用まで、初心者にもわかりやすく解説。通貨ペア、スプレッド、レバレッジなどの基礎知識を習得しましょう。',
    icon: '💱',
    category: 'forex',
    keywords: ['FX', '外国為替', 'forex', '通貨ペア', 'スプレッド', 'レバレッジ'],
    featured: true
  },
  {
    id: 'risk-management',
    title: 'リスク管理・資金管理',
    description: '投資・取引におけるリスク管理の重要性とテクニック。ポジションサイジング、ストップロス、資金管理の実践的な手法を学びます。',
    icon: '🛡️',
    category: 'trading',
    keywords: ['リスク管理', 'ポジションサイジング', 'ストップロス', '資金管理', 'ドローダウン'],
    featured: true
  },
  {
    id: 'insurance-basics',
    title: '保険の基礎知識',
    description: '生命保険、自動車保険、医療保険の選び方と比較ポイント。保険料を抑えながら適切な補償を得るための知識を提供します。',
    icon: '🛡️',
    category: 'insurance',
    keywords: ['保険', '生命保険', '自動車保険', '医療保険', '保険料', '補償'],
    featured: true
  },
  {
    id: 'trading-strategies',
    title: '取引戦略・手法',
    description: 'スキャルピング、デイトレード、スイングトレードなどの取引手法。テクニカル分析とファンダメンタル分析の活用法も解説。',
    icon: '📊',
    category: 'trading',
    keywords: ['取引戦略', 'スキャルピング', 'デイトレード', 'テクニカル分析', 'チャートパターン'],
    featured: true
  },
  {
    id: 'investment-basics',
    title: '投資の基礎',
    description: '株式、債券、ETF、投資信託など各種投資商品の特徴と選び方。資産配分とポートフォリオ構築の基本を学びます。',
    icon: '📈',
    category: 'investment',
    keywords: ['投資', '株式', 'ETF', '投資信託', 'ポートフォリオ', '資産配分'],
    featured: false
  },
  {
    id: 'broker-selection',
    title: 'ブローカー選び',
    description: 'FXブローカーや証券会社の選び方。手数料、安全性、取引プラットフォーム、サポート体制などの比較ポイントを解説。',
    icon: '🏦',
    category: 'forex',
    keywords: ['ブローカー', '業者比較', '手数料', '安全性', '取引プラットフォーム'],
    featured: false
  },
  {
    id: 'market-analysis',
    title: '市場分析・相場解説',
    description: '為替相場や株式市場の動向分析。経済指標、中央銀行政策、地政学的要因が市場に与える影響を解説します。',
    icon: '📊',
    category: 'education',
    keywords: ['市場分析', '相場解説', '経済指標', '中央銀行', '金融政策'],
    featured: false
  },
  {
    id: 'tools-platforms',
    title: '取引ツール・プラットフォーム',
    description: 'MT4/MT5、TradingView、その他の取引プラットフォームの使い方。チャート分析ツールや自動売買システムの活用法。',
    icon: '🛠️',
    category: 'education',
    keywords: ['MT4', 'MT5', 'TradingView', '取引ツール', 'チャート分析', '自動売買'],
    featured: false
  }
];

/**
 * Get topic hub by ID
 */
export function getTopicHub(id: string): TopicHub | null {
  return topicHubs.find(hub => hub.id === id) || null;
}

/**
 * Get all topic hubs
 */
export function getAllTopicHubs(): TopicHub[] {
  return topicHubs;
}

/**
 * Get featured topic hubs
 */
export function getFeaturedTopicHubs(): TopicHub[] {
  return topicHubs.filter(hub => hub.featured);
}

/**
 * Get topic hubs by category
 */
export function getTopicHubsByCategory(category: TopicHub['category']): TopicHub[] {
  return topicHubs.filter(hub => hub.category === category);
}

/**
 * Find related topic hubs based on keywords
 */
export function getRelatedTopicHubs(currentTopicId: string, limit: number = 3): TopicHub[] {
  const currentHub = getTopicHub(currentTopicId);
  if (!currentHub) return [];

  const currentKeywords = currentHub.keywords.map(k => k.toLowerCase());
  
  return topicHubs
    .filter(hub => hub.id !== currentTopicId)
    .map(hub => ({
      hub,
      relevance: hub.keywords.filter(keyword => 
        currentKeywords.some(ck => 
          keyword.toLowerCase().includes(ck) || ck.includes(keyword.toLowerCase())
        )
      ).length
    }))
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map(item => item.hub);
}

/**
 * Curate content for a specific topic hub
 */
export function getCuratedContent(topicId: string): CuratedContent {
  const hub = getTopicHub(topicId);
  if (!hub) {
    return {
      guides: [],
      tools: [],
      brokers: [],
      insurance: [],
      posts: []
    };
  }

  // Get synonyms for better content matching
  const synonyms = getSynonymsForTopic(topicId);
  const allKeywords = [...hub.keywords, ...synonyms].map(k => k.toLowerCase());

  // Filter and score content based on relevance
  const guides = allPosts
    .filter(post => {
      const isGuide = post.tags?.some(tag => 
        ['guide', 'tutorial', 'how-to', 'basics', 'beginner'].includes(tag.toLowerCase())
      ) || post.title.toLowerCase().includes('ガイド') ||
          post.title.toLowerCase().includes('入門') ||
          post.title.toLowerCase().includes('基礎');
      
      if (!isGuide) return false;

      const contentText = `${post.title} ${post.description || ''} ${post.tags?.join(' ') || ''}`.toLowerCase();
      return allKeywords.some(keyword => contentText.includes(keyword));
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
    .map(post => ({
      id: post._id,
      title: post.title,
      description: post.description || '',
      url: post.url,
      publishedAt: post.date,
      featured: allKeywords.some(keyword => post.title.toLowerCase().includes(keyword))
    }));

  // Tools related to the topic
  const tools: CuratedContent['tools'] = [];
  if (topicId === 'fx-basics' || topicId === 'trading-strategies' || topicId === 'risk-management') {
    tools.push(
      {
        id: 'position-size-calculator',
        title: 'ポジションサイズ計算機',
        description: 'リスク管理に基づく適切なポジションサイズを計算',
        url: '/tools/position-size-calculator',
        category: 'リスク管理',
        featured: topicId === 'risk-management'
      },
      {
        id: 'pip-value-calculator',
        title: 'PIP価値計算機',
        description: '通貨ペアのPIP価値を瞬時に計算',
        url: '/tools/pip-value-calculator',
        category: 'FX計算',
        featured: topicId === 'fx-basics'
      },
      {
        id: 'margin-calculator',
        title: 'マージン計算機',
        description: 'レバレッジと取引量から必要証拠金を算出',
        url: '/tools/margin-calculator',
        category: '証拠金管理',
        featured: topicId === 'fx-basics'
      }
    );
  }

  // Related brokers
  const brokers = getAllBrokers()
    .slice(0, 6)
    .map(broker => ({
      id: broker.slug,
      brand: broker.brand,
      description: `${broker.brand}のFXサービス詳細`,
      url: `/best/forex-brokers/${broker.slug}`,
      score: broker.score_total,
      featured: broker.score_total >= 4.0
    }));

  // Related insurance products
  const insurance = loadInsuranceProducts()
    .filter((product: InsuranceProduct) => {
      if (topicId !== 'insurance-basics') return false;
      const contentText = `${product.brand} ${product.category}`.toLowerCase();
      return allKeywords.some(keyword => contentText.includes(keyword));
    })
    .slice(0, 6)
    .map((product: InsuranceProduct) => ({
      id: product.slug,
      company: product.brand,
      category: product.category,
      description: `${product.brand}の${product.category}保険`,
      url: `/insurance/${product.slug}`,
      rating: product.score_total || 0,
      featured: (product.score_total || 0) >= 4.0
    }));

  // Related posts (excluding guides)
  const posts = allPosts
    .filter(post => {
      const isGuide = post.tags?.some(tag => 
        ['guide', 'tutorial', 'how-to', 'basics', 'beginner'].includes(tag.toLowerCase())
      );
      
      if (isGuide) return false; // Exclude guides (already in guides section)

      const contentText = `${post.title} ${post.description || ''} ${post.tags?.join(' ') || ''}`.toLowerCase();
      return allKeywords.some(keyword => contentText.includes(keyword));
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
    .map(post => ({
      id: post._id,
      title: post.title,
      description: post.description || '',
      url: post.url,
      publishedAt: post.date,
      featured: allKeywords.some(keyword => post.title.toLowerCase().includes(keyword))
    }));

  return {
    guides,
    tools,
    brokers,
    insurance,
    posts
  };
}