// News Provider Types and Interfaces

export interface NewsProvider {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  website: string;
  category: 'financial' | 'economic' | 'general' | 'tech' | 'crypto';
  categories?: string[]; // Additional categories for filtering
  country: 'JP' | 'US' | 'GB' | 'GLOBAL';
  languages: string[];
  established?: string;
  establishedYear?: number;
  credibility: 'high' | 'medium' | 'low';
  credibilityScore?: number; // 1-5 rating
  updateFrequency: 'realtime' | 'hourly' | 'daily';
  featured: boolean;
}

export interface NewsVote {
  newsId: string;
  vote: 'up' | 'down';
  timestamp: number;
  userAgent?: string;
  ip?: string; // Hashed for privacy
}

export interface NewsVoteStats {
  newsId: string;
  upvotes: number;
  downvotes: number;
  score: number; // upvotes - downvotes
  totalVotes: number;
  lastUpdated: number;
}

export interface PopularNews {
  newsId: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
  score: number;
  votes: NewsVoteStats;
}

export interface ProviderArchive {
  providerId: string;
  provider: NewsProvider;
  articles: NewsItem[];
  totalCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  dateRange: {
    from: string;
    to: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
  snippet?: string;
  category?: string;
  votes?: NewsVoteStats;
}

// KV Storage Interfaces
export interface NewsVoteKV {
  key: `news_votes:${string}`; // news_votes:{newsId}
  value: NewsVoteStats;
  expiration?: number; // Optional TTL
}

export interface ProviderStatsKV {
  key: `provider_stats:${string}`; // provider_stats:{providerId}
  value: {
    totalArticles: number;
    last24h: number;
    last7d: number;
    last30d: number;
    lastUpdated: number;
  };
}

export interface PopularNewsKV {
  key: `popular_news:${string}`; // popular_news:{window} (24h, 7d, etc.)
  value: PopularNews[];
  expiration: number; // Auto-expire
}