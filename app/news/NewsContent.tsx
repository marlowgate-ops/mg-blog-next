'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { z } from 'zod';
import { useDebounce } from '@/hooks/useDebounce';
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

function formatRelativeTime(dateString: string): string {
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

export default function NewsContent() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  
  // Use URL state management with type safety
  const [urlState, setUrlState] = useUrlState({
    schema: newsUrlSchema,
    defaults: { q: '', providers: [], period: 'week' as const, offset: 0 },
  });
  
  // Local state for search input (immediate updates)
  const [searchQuery, setSearchQuery] = useState(urlState.q);
  
  // Debounce search query for auto-updating URL while typing
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const sources = newsSources as NewsSource[];
  
  // Sync search query with URL state
  useEffect(() => {
    setSearchQuery(urlState.q);
  }, [urlState.q]);
  
  // Auto-update URL on debounced search (only if user typed)
  useEffect(() => {
    if (debouncedSearchQuery !== urlState.q) {
      setUrlState({ q: debouncedSearchQuery, offset: 0 });
    }
  }, [debouncedSearchQuery, urlState.q, setUrlState]);

  // Fetch news data
  const fetchNews = async (offset = 0, providers: string[] = [], period: 'day' | 'week' = 'week', query = '', replace = true) => {
    try {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);
      
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('offset', offset.toString());
      params.set('period', period);
      if (providers.length > 0) {
        params.set('providers', providers.join(','));
      }
      if (query.trim()) {
        params.set('q', query.trim());
      }
      
      const response = await fetch(`/api/news?${params}`);
      const data: NewsResponse = await response.json();
      
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
  };

  // Fetch news when URL state changes
  useEffect(() => {
    fetchNews(urlState.offset, urlState.providers, urlState.period, urlState.q, urlState.offset === 0);
  }, [urlState.providers, urlState.period, urlState.q, urlState.offset]);
  
  const handleProviderToggle = (providerId: string) => {
    const providers = urlState.providers || [];
    const newProviders = providers.includes(providerId)
      ? providers.filter(p => p !== providerId)
      : [...providers, providerId];
    
    setUrlState({ providers: newProviders, offset: 0 });
  };
  
  const handlePeriodToggle = (period: 'day' | 'week') => {
    setUrlState({ period, offset: 0 });
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentValue = e.currentTarget.value;
      setUrlState({ q: currentValue.trim(), offset: 0 });
    }
  };

  const handleLoadMore = () => {
    if (nextOffset !== null) {
      setUrlState({ offset: nextOffset });
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
            onClick={() => setUrlState({ providers: [], offset: 0 })}
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