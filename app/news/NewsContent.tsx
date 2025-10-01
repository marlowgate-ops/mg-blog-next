'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
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
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasReadInitialParams, setHasReadInitialParams] = useState(false);
  const [userHasTyped, setUserHasTyped] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Debounce search query for auto-updating URL while typing
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const sources = newsSources as NewsSource[];
  
  // Read URL parameters on mount/navigation
  useEffect(() => {
    const providersParam = searchParams.get('providers');
    const periodParam = searchParams.get('period');
    const queryParam = searchParams.get('q');
    const offsetParam = searchParams.get('offset');
    
    console.log('[NewsContent] Reading URL params:', { providersParam, periodParam, queryParam, offsetParam, url: window.location.href });
    
    // Update providers
    const providers = providersParam ? providersParam.split(',').filter(Boolean) : [];
    setSelectedProviders(providers);
    
    // Update period
    const period = (periodParam === 'day' || periodParam === 'week') ? periodParam : 'week';
    setSelectedPeriod(period);
    
    // Update search query - ALWAYS set it, even if empty
    const query = queryParam || '';
    console.log('[NewsContent] Setting searchQuery from URL:', query);
    setSearchQuery(query);
    
    // Update offset
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
    setCurrentOffset(isNaN(offset) ? 0 : offset);
    
    // Mark that initial params are read
    setHasReadInitialParams(true);
  }, [searchParams]);
  
  // Update URL when debounced search completes (only while typing, not on initial load)
  useEffect(() => {
    // Only update URL if user has actively typed (not from hydration)
    if (!hasReadInitialParams || !userHasTyped) {
      return;
    }
    
    updateURL(selectedProviders, selectedPeriod, debouncedSearchQuery);
    setUserHasTyped(false); // Reset flag after updating
  }, [debouncedSearchQuery]); // Only trigger on debounced query change
  
  // Centralized URL update function - always preserves current URL state
  const updateURL = useCallback((providers: string[], period: 'day' | 'week', query?: string) => {
    console.log('[NewsContent] updateURL called with:', { providers, period, query });
    
    // Start with current search params to preserve any other params
    const params = new URLSearchParams(window.location.search);
    
    // Update/remove provider param
    if (providers.length > 0) {
      params.set('providers', providers.join(','));
    } else {
      params.delete('providers');
    }
    
    // Always set period
    params.set('period', period);
    
    // Update/remove query param (undefined means keep current value from URL)
    if (query !== undefined) {
      if (query.trim()) {
        params.set('q', query.trim());
      } else {
        params.delete('q');
      }
    }
    // If query is undefined, keep the existing 'q' param from current URL (already in params)
    
    // Remove offset when filters change (start from beginning)
    params.delete('offset');
    
    const newUrl = `/news?${params.toString()}`;
    console.log('[NewsContent] Updating URL to:', newUrl);
    router.replace(newUrl);
  }, [router]);

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
        setCurrentOffset(0);
      } else {
        setItems(prev => [...prev, ...data.items]);
        setCurrentOffset(offset);
      }
      
      setNextOffset(data.nextOffset);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch news when filters or search query changes
  useEffect(() => {
    // Use immediate searchQuery during initial load, debouncedSearchQuery otherwise
    const queryToUse = hasReadInitialParams ? debouncedSearchQuery : searchQuery;
    fetchNews(0, selectedProviders, selectedPeriod, queryToUse);
  }, [selectedProviders, selectedPeriod, debouncedSearchQuery, hasReadInitialParams]);
  
  const handleProviderToggle = (providerId: string) => {
    const newProviders = selectedProviders.includes(providerId)
      ? selectedProviders.filter(p => p !== providerId)
      : [...selectedProviders, providerId];
    
    setSelectedProviders(newProviders);
    // Don't pass query - let it be preserved from current URL
    updateURL(newProviders, selectedPeriod);
  };
  
  const handlePeriodToggle = (period: 'day' | 'week') => {
    setSelectedPeriod(period);
    // Don't pass query - let it be preserved from current URL
    updateURL(selectedProviders, period);
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevent form submission
      // Update URL immediately with current search value (don't wait for debounce)
      const currentValue = e.currentTarget.value;
      setSearchQuery(currentValue);
      setUserHasTyped(false); // Prevent debounce from updating again
      updateURL(selectedProviders, selectedPeriod, currentValue);
    }
  };

  const handleLoadMore = () => {
    if (nextOffset !== null) {
      fetchNews(nextOffset, selectedProviders, selectedPeriod, debouncedSearchQuery, false);
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setUserHasTyped(true);
              }}
              onKeyDown={handleSearchKeyDown}
              className={styles.searchField}
              data-testid="news-search-input"
            />
          </div>
          
          <div className={styles.periodToggle}>
            <select
              value={selectedPeriod}
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
            className={`${styles.chip} ${selectedProviders.length === 0 ? styles.active : ''}`}
            onClick={() => {
              setSelectedProviders([]);
              // Don't pass query - preserve it from URL
              updateURL([], selectedPeriod);
            }}
            data-testid="provider-chip-all"
          >
            すべて
          </button>
          
          {sources.map(source => (
            <button
              key={source.id}
              className={`${styles.chip} ${selectedProviders.includes(source.id) ? styles.active : ''}`}
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