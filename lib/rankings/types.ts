// Rankings and Popular Content Types

export interface RankingItem {
  id: string;
  title: string;
  slug: string;
  url: string;
  type: 'news' | 'broker' | 'insurance' | 'post' | 'tool' | 'tag';
  score: number;
  clicks: number;
  views: number;
  lastUpdated: string;
  imageUrl?: string;
  category?: string;
  provider?: string;
  excerpt?: string;
}

export interface RankingData {
  window: '24h' | '7d';
  type: 'news' | 'brokers' | 'insurance' | 'posts' | 'tools' | 'tags' | 'all';
  items: RankingItem[];
  totalItems: number;
  lastUpdated: string;
  generatedAt: string;
}

export interface GA4Event {
  event_name: 'news_link_click' | 'broker_outbound_click' | 'insurance_outbound_click' | 'tool_calc_use' | 'post_view';
  event_parameters: {
    item_id: string;
    item_name: string;
    item_category?: string;
    content_type?: string;
    page_location?: string;
    timestamp: number;
  };
}

export interface KVRankingKey {
  // Daily rankings: kv:rank:news:YYYYMMDD
  daily: `kv:rank:${string}:${string}`;
  // Window aggregations: kv:rank:24h:news, kv:rank:7d:brokers
  window: `kv:rank:${string}:${string}`;
  // Trending keywords: kv:trending:YYYYMMDD
  trending: `kv:trending:${string}`;
}

export interface TrendingKeyword {
  keyword: string;
  searches: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface PopularContent {
  news: RankingItem[];
  brokers: RankingItem[];
  insurance: RankingItem[];
  posts: RankingItem[];
  tools: RankingItem[];
  tags: RankingItem[];
}

export interface RankingsResponse {
  data: RankingData;
  cache: {
    hit: boolean;
    ttl: number;
    key: string;
  };
}

// Utility types for API responses
export type RankingWindow = '24h' | '7d';
export type RankingType = 'news' | 'brokers' | 'insurance' | 'posts' | 'tools' | 'tags' | 'all';

export interface RankingsApiParams {
  window?: RankingWindow;
  type?: RankingType;
  limit?: number;
  offset?: number;
}