import { NewsVoteStats, PopularNews } from './types';

// In-memory storage for development (replace with actual KV in production)
const voteStorage = new Map<string, NewsVoteStats>();
const popularCache = new Map<string, PopularNews[]>();

// KV Storage Interface (to be implemented with actual KV store)
interface KVStore {
  get(key: string): Promise<any>;
  put(key: string, value: any, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

// Mock KV for development
const mockKV: KVStore = {
  async get(key: string) {
    if (key.startsWith('news_votes:')) {
      return voteStorage.get(key);
    }
    if (key.startsWith('popular_news:')) {
      return popularCache.get(key);
    }
    return null;
  },
  
  async put(key: string, value: any, options?: { expirationTtl?: number }) {
    if (key.startsWith('news_votes:')) {
      voteStorage.set(key, value);
    }
    if (key.startsWith('popular_news:')) {
      popularCache.set(key, value);
      // Auto-expire after TTL
      if (options?.expirationTtl) {
        setTimeout(() => popularCache.delete(key), options.expirationTtl * 1000);
      }
    }
  },
  
  async delete(key: string) {
    voteStorage.delete(key);
    popularCache.delete(key);
  }
};

// Vote Management Functions
export async function getNewsVotes(newsId: string): Promise<NewsVoteStats> {
  const key = `news_votes:${newsId}`;
  const votes = await mockKV.get(key);
  
  if (!votes) {
    return {
      newsId,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      totalVotes: 0,
      lastUpdated: Date.now()
    };
  }
  
  return votes;
}

export async function castVote(newsId: string, vote: 'up' | 'down', _userIdentifier: string): Promise<NewsVoteStats> {
  const current = await getNewsVotes(newsId);
  
  // Simple voting logic (in production, track user votes to prevent duplicates)
  const updated: NewsVoteStats = {
    ...current,
    upvotes: vote === 'up' ? current.upvotes + 1 : current.upvotes,
    downvotes: vote === 'down' ? current.downvotes + 1 : current.downvotes,
    lastUpdated: Date.now()
  };
  
  updated.totalVotes = updated.upvotes + updated.downvotes;
  updated.score = updated.upvotes - updated.downvotes;
  
  const key = `news_votes:${newsId}`;
  await mockKV.put(key, updated, { expirationTtl: 7 * 24 * 60 * 60 }); // 7 days
  
  return updated;
}

export async function getPopularNews(window: '24h' | '7d' = '24h'): Promise<PopularNews[]> {
  const key = `popular_news:${window}`;
  const cached = await mockKV.get(key);
  
  if (cached) {
    return cached;
  }
  
  // In production, this would query news with vote stats
  // For now, return mock popular news
  const mockPopular: PopularNews[] = [
    {
      newsId: 'mock-1',
      title: 'FOMCが政策金利を0.25%引き下げ、市場予想通り',
      url: 'https://reuters.com/example',
      sourceId: 'reuters',
      sourceName: 'Reuters',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      score: 15,
      votes: {
        newsId: 'mock-1',
        upvotes: 18,
        downvotes: 3,
        score: 15,
        totalVotes: 21,
        lastUpdated: Date.now()
      }
    },
    {
      newsId: 'mock-2',
      title: '日銀、金融緩和政策の維持を決定',
      url: 'https://nikkei.com/example',
      sourceId: 'nikkei',
      sourceName: '日本経済新聞',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      score: 12,
      votes: {
        newsId: 'mock-2',
        upvotes: 14,
        downvotes: 2,
        score: 12,
        totalVotes: 16,
        lastUpdated: Date.now()
      }
    },
    {
      newsId: 'mock-3',
      title: 'ビットコイン、機関投資家の買いで35,000ドル突破',
      url: 'https://coindesk.com/example',
      sourceId: 'coindesk',
      sourceName: 'CoinDesk',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      score: 8,
      votes: {
        newsId: 'mock-3',
        upvotes: 11,
        downvotes: 3,
        score: 8,
        totalVotes: 14,
        lastUpdated: Date.now()
      }
    }
  ];
  
  // Cache for the specified window
  const ttl = window === '24h' ? 60 * 60 : 24 * 60 * 60; // 1 hour or 1 day
  await mockKV.put(key, mockPopular, { expirationTtl: ttl });
  
  return mockPopular;
}

export async function updatePopularNews(): Promise<void> {
  // This would run periodically to update popular news rankings
  // based on recent votes and engagement
  
  // For now, just refresh the cache
  await mockKV.delete('popular_news:24h');
  await mockKV.delete('popular_news:7d');
}

// Utility functions for vote display
export function formatVoteCount(count: number): string {
  if (count === 0) return '';
  if (count < 1000) return count.toString();
  if (count < 10000) return `${Math.floor(count / 100) / 10}k`;
  return `${Math.floor(count / 1000)}k`;
}

export function getVotePercentage(upvotes: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return Math.round((upvotes / totalVotes) * 100);
}

export function shouldShowVotes(votes: NewsVoteStats): boolean {
  return votes.totalVotes >= 3; // Only show votes if there are at least 3 votes
}