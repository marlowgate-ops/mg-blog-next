import { RankingItem, RankingData, GA4Event, PopularContent } from './types';

// Mock KV store for development (replace with actual KV in production)
const rankingStorage = new Map<string, any>();

// Date utilities
function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateKey(yesterday);
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(getDateKey(date));
  }
  return days;
}

// KV Storage Interface
interface KVStore {
  get<T>(key: string): Promise<T | null>;
  put<T>(key: string, value: T, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

// Mock KV implementation
const mockKV: KVStore = {
  async get<T>(key: string): Promise<T | null> {
    return rankingStorage.get(key) || null;
  },
  
  async put<T>(key: string, value: T, options?: { expirationTtl?: number }): Promise<void> {
    rankingStorage.set(key, value);
    if (options?.expirationTtl) {
      setTimeout(() => rankingStorage.delete(key), options.expirationTtl * 1000);
    }
  },
  
  async delete(key: string): Promise<void> {
    rankingStorage.delete(key);
  },
  
  async list(prefix: string): Promise<string[]> {
    return Array.from(rankingStorage.keys()).filter(key => key.startsWith(prefix));
  }
};

// Core ranking functions
export async function trackGA4Event(event: GA4Event): Promise<void> {
  const dateKey = getDateKey();
  const { event_name, event_parameters } = event;
  
  // Determine content type from event
  let contentType: string;
  switch (event_name) {
    case 'news_link_click':
      contentType = 'news';
      break;
    case 'broker_outbound_click':
      contentType = 'brokers';
      break;
    case 'insurance_outbound_click':
      contentType = 'insurance';
      break;
    case 'tool_calc_use':
      contentType = 'tools';
      break;
    case 'post_view':
      contentType = 'posts';
      break;
    default:
      return; // Unknown event type
  }
  
  const dailyKey = `kv:rank:${contentType}:${dateKey}`;
  const currentData = await mockKV.get<Record<string, number>>(dailyKey) || {};
  
  // Increment click count for this item
  const itemKey = event_parameters.item_id;
  currentData[itemKey] = (currentData[itemKey] || 0) + 1;
  
  // Store with 30-day TTL
  await mockKV.put(dailyKey, currentData, { expirationTtl: 30 * 24 * 60 * 60 });
}

export async function getRankingData(
  type: string,
  window: '24h' | '7d' = '24h',
  limit: number = 20
): Promise<RankingData> {
  const cacheKey = `kv:rank:${window}:${type}`;
  
  // Try cache first
  const cached = await mockKV.get<RankingData>(cacheKey);
  if (cached && Date.now() - new Date(cached.generatedAt).getTime() < 30 * 60 * 1000) {
    return cached;
  }
  
  // Generate fresh ranking data
  const items = await generateRankingItems(type, window, limit);
  
  const rankingData: RankingData = {
    window,
    type: type as any,
    items,
    totalItems: items.length,
    lastUpdated: new Date().toISOString(),
    generatedAt: new Date().toISOString()
  };
  
  // Cache for 30 minutes
  await mockKV.put(cacheKey, rankingData, { expirationTtl: 30 * 60 });
  
  return rankingData;
}

async function generateRankingItems(
  type: string,
  window: '24h' | '7d',
  limit: number
): Promise<RankingItem[]> {
  
  // Get date keys for the window
  const dateKeys = window === '24h' ? [getDateKey()] : getLast7Days();
  
  // Aggregate clicks across date range
  const aggregatedClicks: Record<string, number> = {};
  
  for (const dateKey of dateKeys) {
    const dailyKey = `kv:rank:${type}:${dateKey}`;
    const dailyData = await mockKV.get<Record<string, number>>(dailyKey) || {};
    
    for (const [itemId, clicks] of Object.entries(dailyData)) {
      aggregatedClicks[itemId] = (aggregatedClicks[itemId] || 0) + clicks;
    }
  }
  
  // Generate mock content for demonstration
  const mockItems = await generateMockRankingItems(type, aggregatedClicks);
  
  // Sort by score and limit
  return mockItems
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function generateMockRankingItems(
  type: string,
  clickData: Record<string, number>
): Promise<RankingItem[]> {
  
  // Mock data generation - in production this would query actual content
  const items: RankingItem[] = [];
  
  switch (type) {
    case 'news':
      items.push(
        {
          id: 'news-1',
          title: 'FOMCが政策金利を引き下げ、市場は好反応',
          slug: 'fomc-rate-cut-market-reaction',
          url: '/news/fomc-rate-cut-market-reaction',
          type: 'news',
          score: clickData['news-1'] || 45,
          clicks: clickData['news-1'] || 45,
          views: 1250,
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: 'monetary-policy',
          provider: 'Reuters',
          excerpt: 'FRBは政策金利を0.25%引き下げ、市場参加者は追加緩和を期待'
        },
        {
          id: 'news-2',
          title: '日銀、金融緩和政策の継続を決定',
          slug: 'boj-maintains-easing-policy',
          url: '/news/boj-maintains-easing-policy',
          type: 'news',
          score: clickData['news-2'] || 38,
          clicks: clickData['news-2'] || 38,
          views: 920,
          lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'monetary-policy',
          provider: 'Nikkei',
          excerpt: '日本銀行は金融政策決定会合で現行の緩和政策維持を決定'
        }
      );
      break;
      
    case 'brokers':
      items.push(
        {
          id: 'dmm-fx',
          title: 'DMM FX',
          slug: 'dmm-fx',
          url: '/brokers/dmm-fx',
          type: 'broker',
          score: clickData['dmm-fx'] || 67,
          clicks: clickData['dmm-fx'] || 67,
          views: 2340,
          lastUpdated: new Date().toISOString(),
          category: 'fx-broker',
          excerpt: '業界最狭水準のスプレッドと充実したサポート体制'
        },
        {
          id: 'gmo-click',
          title: 'GMOクリック証券',
          slug: 'gmo-click',
          url: '/brokers/gmo-click',
          type: 'broker',
          score: clickData['gmo-click'] || 54,
          clicks: clickData['gmo-click'] || 54,
          views: 1890,
          lastUpdated: new Date().toISOString(),
          category: 'fx-broker',
          excerpt: 'FX取引高世界第1位の信頼と実績'
        }
      );
      break;
      
    case 'insurance':
      items.push(
        {
          id: 'tokio-marine-tap',
          title: '東京海上日動あんしん生命TAP',
          slug: 'tokio-marine-tap',
          url: '/insurance/tokio-marine-tap',
          type: 'insurance',
          score: clickData['tokio-marine-tap'] || 34,
          clicks: clickData['tokio-marine-tap'] || 34,
          views: 780,
          lastUpdated: new Date().toISOString(),
          category: 'life-insurance',
          excerpt: 'タップだけで加入できる新しい生命保険'
        }
      );
      break;
      
    case 'posts':
      items.push(
        {
          id: 'fx-basics-guide',
          title: 'FX初心者のための完全ガイド',
          slug: 'fx-basics-guide',
          url: '/blog/fx-basics-guide',
          type: 'post',
          score: clickData['fx-basics-guide'] || 89,
          clicks: clickData['fx-basics-guide'] || 89,
          views: 3240,
          lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          category: 'guide',
          excerpt: 'FX取引を始める前に知っておくべき基本知識を詳しく解説'
        }
      );
      break;
      
    case 'tools':
      items.push(
        {
          id: 'position-size-calculator',
          title: 'ポジションサイズ計算ツール',
          slug: 'position-size-calculator',
          url: '/tools/position-size-calculator',
          type: 'tool',
          score: clickData['position-size-calculator'] || 42,
          clicks: clickData['position-size-calculator'] || 42,
          views: 1150,
          lastUpdated: new Date().toISOString(),
          category: 'calculator',
          excerpt: 'リスク管理に基づいた適切なポジションサイズを計算'
        }
      );
      break;
      
    case 'tags':
      items.push(
        {
          id: 'fx-basics',
          title: 'FX基礎',
          slug: 'fx-basics',
          url: '/tags/fx-basics',
          type: 'tag',
          score: clickData['fx-basics'] || 156,
          clicks: clickData['fx-basics'] || 156,
          views: 4200,
          lastUpdated: new Date().toISOString(),
          category: 'tag',
          excerpt: 'FX取引の基本に関する記事 (45記事)'
        }
      );
      break;
  }
  
  return items;
}

export async function getPopularContent(window: '24h' | '7d' = '24h'): Promise<PopularContent> {
  const [news, brokers, insurance, posts, tools, tags] = await Promise.all([
    getRankingData('news', window, 5),
    getRankingData('brokers', window, 5),
    getRankingData('insurance', window, 5),
    getRankingData('posts', window, 5),
    getRankingData('tools', window, 5),
    getRankingData('tags', window, 5)
  ]);
  
  return {
    news: news.items,
    brokers: brokers.items,
    insurance: insurance.items,
    posts: posts.items,
    tools: tools.items,
    tags: tags.items
  };
}

export async function invalidateRankingCache(type?: string): Promise<void> {
  const windows = ['24h', '7d'];
  const types = type ? [type] : ['news', 'brokers', 'insurance', 'posts', 'tools', 'tags'];
  
  for (const w of windows) {
    for (const t of types) {
      const key = `kv:rank:${w}:${t}`;
      await mockKV.delete(key);
    }
  }
}