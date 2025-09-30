'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import JsonLdItemList from '@/components/JsonLdItemList';
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
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const sources = newsSources as NewsSource[];
  
  // Update URL when providers, period, or search change
  useEffect(() => {
    const providersParam = searchParams.get('providers');
    const periodParam = searchParams.get('period');
    const queryParam = searchParams.get('q');
    const offsetParam = searchParams.get('offset');
    
    if (providersParam) {
      setSelectedProviders(providersParam.split(',').filter(Boolean));
    }
    
    if (periodParam === 'day' || periodParam === 'week') {
      setSelectedPeriod(periodParam);
    }
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
    
    if (offsetParam) {
      const offset = parseInt(offsetParam, 10);
      if (!isNaN(offset)) {
        setCurrentOffset(offset);
      }
    }
  }, [searchParams]);
  
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
  
  // Initial load
  useEffect(() => {
    fetchNews(0, selectedProviders, selectedPeriod, debouncedSearchQuery);
  }, [selectedProviders, selectedPeriod, debouncedSearchQuery]);

  // Update URL when debounced search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchQuery.trim()) {
      params.set('q', debouncedSearchQuery.trim());
    } else {
      params.delete('q');
    }
    params.delete('offset'); // Reset pagination on search change
    
    // Only update URL if search query actually changed
    const currentQuery = searchParams.get('q') || '';
    if (currentQuery !== debouncedSearchQuery.trim()) {
      router.replace(`/news?${params.toString()}`);
    }
  }, [debouncedSearchQuery, searchParams, router]);
  
  const handleProviderToggle = (providerId: string) => {
    const newProviders = selectedProviders.includes(providerId)
      ? selectedProviders.filter(p => p !== providerId)
      : [...selectedProviders, providerId];
    
    setSelectedProviders(newProviders);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (newProviders.length > 0) {
      params.set('providers', newProviders.join(','));
    } else {
      params.delete('providers');
    }
    params.set('period', selectedPeriod);
    if (debouncedSearchQuery.trim()) {
      params.set('q', debouncedSearchQuery.trim());
    } else {
      params.delete('q');
    }
    params.delete('offset'); // Reset pagination on filter change
    router.replace(`/news?${params.toString()}`);
  };
  
  const handlePeriodToggle = (period: 'day' | 'week') => {
    setSelectedPeriod(period);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set('period', period);
    if (selectedProviders.length > 0) {
      params.set('providers', selectedProviders.join(','));
    }
    if (debouncedSearchQuery.trim()) {
      params.set('q', debouncedSearchQuery.trim());
    } else {
      params.delete('q');
    }
    params.delete('offset'); // Reset pagination on filter change
    router.replace(`/news?${params.toString()}`);
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
      <div className={styles.content}>
        {/* Period and Provider filters */}
        <div className={styles.filters}>
        <div className={styles.topFilters}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="記事のタイトルを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchField}
            />
          </div>
          
          <div className={styles.periodToggle}>
            <button
              className={`${styles.periodButton} ${selectedPeriod === 'day' ? styles.active : ''}`}
              onClick={() => handlePeriodToggle('day')}
              data-period="day"
            >
              今日
            </button>
            <button
              className={`${styles.periodButton} ${selectedPeriod === 'week' ? styles.active : ''}`}
              onClick={() => handlePeriodToggle('week')}
              data-period="week"
            >
              1週間
            </button>
          </div>
        </div>
        
        <div className={styles.providerChips}>
          <button
            className={`${styles.chip} ${selectedProviders.length === 0 ? styles.active : ''}`}
            onClick={() => {
              setSelectedProviders([]);
              const params = new URLSearchParams(searchParams);
              params.delete('providers');
              params.set('period', selectedPeriod);
              if (debouncedSearchQuery.trim()) {
                params.set('q', debouncedSearchQuery.trim());
              } else {
                params.delete('q');
              }
              params.delete('offset'); // Reset pagination on filter change
              router.replace(`/news?${params.toString()}`);
            }}
          >
            すべて
          </button>
          
          {sources.map(source => (
            <button
              key={source.id}
              className={`${styles.chip} ${selectedProviders.includes(source.id) ? styles.active : ''}`}
              onClick={() => handleProviderToggle(source.id)}
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
                      <span className={styles.sourceName}>{item.sourceName}</span>
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