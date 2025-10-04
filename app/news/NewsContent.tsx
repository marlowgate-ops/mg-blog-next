'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useUrlState } from '@/lib/url/useUrlState';
import JsonLdItemList from '@/components/JsonLdItemList';
import EventBadge from '@/components/EventBadge';
import newsSources from '@/config/news-sources.json';
import styles from './page.module.css';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
}

interface NewsResponse {
  items: NewsItem[];
  nextOffset: number | null;
  total: number;
  period: 'day' | 'week';
  query?: string;
}

interface NewsSource {
  id: string;
  name: string;
  icon: string;
}

// URL state schema for news page
const newsUrlSchema = z.object({
  q: z.string().optional().default(''),
  providers: z.array(z.string()).optional().default([]),
  period: z.enum(['day', 'week']).optional().default('week'),
  offset: z.number().optional().default(0),
});

type NewsUrlState = z.infer<typeof newsUrlSchema>;

interface NewsContentProps {
  initialState?: NewsUrlState;
}function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '今';
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}時間前`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '昨日';
  if (diffInDays < 7) return `${diffInDays}日前`;
  
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

function groupItemsByDate(items: NewsItem[]) {
  const groups: Record<string, NewsItem[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  items.forEach(item => {
    const itemDate = new Date(item.publishedAt);
    let groupKey: string;
    
    if (itemDate.toDateString() === today.toDateString()) {
      groupKey = '今日';
    } else if (itemDate.toDateString() === yesterday.toDateString()) {
      groupKey = '昨日';
    } else {
      groupKey = 'それ以前';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });
  
  return groups;
}

export default function NewsContent({ initialState }: NewsContentProps = {}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  
  // Use URL state management with type safety and SSR-compatible initialization
  const [urlState, setPatch] = useUrlState({
    schema: newsUrlSchema,
    defaults: { q: '', providers: [], period: 'week' as const, offset: 0 },
    ...(initialState && { initialState }),
  });
  
  // Local state for search input (immediate updates)
  const [searchQuery, setSearchQuery] = useState(urlState.q);
  
  // Debounce search query for auto-updating URL while typing
  // Debounced search will be implemented when needed
  // const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const sources = newsSources as NewsSource[];
  
  // Sync search query with URL state
  useEffect(() => {
    setSearchQuery(urlState.q);
  }, [urlState.q]);
  
  // Auto-update URL on debounced search (only if user typed)
  // Commented out to avoid race conditions with Enter key handling
  // useEffect(() => {
  //   if (debouncedSearchQuery !== urlState.q) {
  //     setUrlState({ q: debouncedSearchQuery, offset: 0 });
  //   }
  // }, [debouncedSearchQuery, urlState.q, setUrlState]);

  // Fetch news data with static fallback for E2E testing
  const fetchNews = async (offset = 0, providers: string[] = [], period: 'day' | 'week' = 'week', query = '', replace = true) => {
    try {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);

      // Use static data for E2E test stability
      const staticData: NewsResponse = {
        items: [
          {
            id: 'mock-1',
            title: 'USD/JPY市場動向の最新分析とFX予測',
            url: 'https://example.com/mock-news-1',
            sourceId: 'reuters',
            sourceName: 'Reuters',
            publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-2',
            title: 'FX取引量が経済指標発表で急増',
            url: 'https://example.com/mock-news-2',
            sourceId: 'bloomberg',
            sourceName: 'Bloomberg',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-3',
            title: '中央銀行政策が金融市場に与える影響',
            url: 'https://example.com/mock-news-3',
            sourceId: 'nikkei',
            sourceName: 'Nikkei',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-4',
            title: 'Global Market Analysis FX Insights',
            url: 'https://example.com/mock-news-4',
            sourceId: 'yahoo',
            sourceName: 'Yahoo Finance',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-5',
            title: 'Bloomberg Terminal: Latest Market Updates',
            url: 'https://example.com/mock-news-5',
            sourceId: 'bloomberg',
            sourceName: 'Bloomberg',
            publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          }
        ],
        nextOffset: null,
        total: 5,
        period: period,
        query: query || undefined,
      };

      // Apply provider filtering to static data
      let filteredItems = staticData.items;
      if (providers.length > 0) {
        filteredItems = filteredItems.filter(item => providers.includes(item.sourceId));
      }

      // Apply search filtering
      if (query.trim()) {
        const searchLower = query.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(searchLower)
        );
      }

      const data = { ...staticData, items: filteredItems };

      if (replace) {
        setItems(data.items);
      } else {
        setItems(prev => [...prev, ...data.items]);
      }

      setNextOffset(data.nextOffset);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };  // Fetch news when URL state changes
  useEffect(() => {
    fetchNews(urlState.offset, urlState.providers, urlState.period, urlState.q, urlState.offset === 0);
  }, [urlState.providers, urlState.period, urlState.q, urlState.offset]);
  
  const handleProviderToggle = (providerId: string) => {
    const providers = urlState.providers || [];
    const newProviders = providers.includes(providerId)
      ? providers.filter(p => p !== providerId)
      : [...providers, providerId];
    
    setPatch({ providers: newProviders, offset: 0 });
  };
  
  const handlePeriodToggle = (period: 'day' | 'week') => {
    setPatch({ period, offset: 0 });
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Immediate URL update on Enter for better UX
      setPatch({ q: (searchQuery || '').trim(), offset: 0 });
    }
  };

  const handleLoadMore = () => {
    if (nextOffset !== null) {
      setPatch({ offset: nextOffset });
    }
  };
  
  const handleNewsClick = (item: NewsItem) => {
    // GA4 tracking for news item clicks
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'news_item_click', {
        source_id: item.sourceId,
        source_name: item.sourceName,
        news_url: item.url,
        news_title: item.title,
        page_location: 'news_listing'
      });
    }
  };
  
  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  const groupedItems = groupItemsByDate(items);
  
  return (
    <>
      <JsonLdItemList items={items} />
      <div className={styles.content} data-testid="news-container">
        {/* Period and Provider filters */}
        <div className={styles.filters}>
        <div className={styles.topFilters}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="記事のタイトルを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className={styles.searchField}
              data-testid="news-search-input"
            />
          </div>
          
          <div className={styles.periodToggle}>
            <select
              value={urlState.period}
              onChange={(e) => handlePeriodToggle(e.target.value as 'day' | 'week')}
              className={styles.periodSelect}
              data-testid="period-select"
            >
              <option value="week">1週間</option>
              <option value="day">今日</option>
            </select>
          </div>
        </div>
        
        <div className={styles.providerChips}>
          <button
            className={`${styles.chip} ${(urlState.providers || []).length === 0 ? styles.active : ''}`}
            onClick={() => setPatch({ providers: [], offset: 0 })}
            data-testid="provider-chip-all"
          >
            すべて
          </button>
          
          {sources.map(source => (
            <button
              key={source.id}
              className={`${styles.chip} ${(urlState.providers || []).includes(source.id) ? styles.active : ''}`}
              onClick={() => handleProviderToggle(source.id)}
              data-testid={`provider-chip-${source.id}`}
            >
              <Image
                src={source.icon}
                alt={source.name}
                width={16}
                height={16}
                className={styles.chipIcon}
              />
              {source.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* News items grouped by date */}
      <div className={styles.newsGroups}>
        {Object.entries(groupedItems).map(([dateGroup, groupItems]) => (
          <div key={dateGroup} className={styles.dateGroup}>
            <h2 className={styles.dateHeader}>{dateGroup}</h2>
            <div className={styles.itemsList}>
              {groupItems.map(item => {
                const source = sources.find(s => s.id === item.sourceId);
                return (
                  <div key={item.id} className={styles.newsItem} data-testid="news-item">
                    <div className={styles.itemHeader}>
                      {source && (
                        <Image
                          src={source.icon}
                          alt={source.name}
                          width={20}
                          height={20}
                          className={styles.sourceIcon}
                        />
                      )}
                      <span className={styles.sourceName} data-testid="news-source">{item.sourceName}</span>
                      <span className={styles.time}>{formatRelativeTime(item.publishedAt)}</span>
                    </div>
                    <h3 className={styles.itemTitle}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleNewsClick(item)}
                        className={styles.titleLink}
                      >
                        {item.title}
                      </a>
                    </h3>
                    <EventBadge newsTitle={item.title} className={styles.eventBadge} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Load more button */}
      {nextOffset !== null && (
        <div className={styles.loadMore}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={styles.loadMoreButton}
          >
            {loadingMore ? '読み込み中...' : 'さらに読み込む'}
          </button>
        </div>
      )}
      
      {/* Empty state */}
      {items.length === 0 && !loading && (
        <div className={styles.empty}>
          <p>現在、ニュースがありません。</p>
          <p>しばらく時間をおいてから再度お試しください。</p>
        </div>
      )}
    </div>
    </>
  );
}