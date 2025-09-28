'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sources = newsSources as NewsSource[];
  
  // Update URL when providers change
  useEffect(() => {
    const providersParam = searchParams.get('providers');
    if (providersParam) {
      setSelectedProviders(providersParam.split(',').filter(Boolean));
    }
  }, [searchParams]);
  
  // Fetch news data
  const fetchNews = async (offset = 0, providers: string[] = [], replace = true) => {
    try {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);
      
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('offset', offset.toString());
      if (providers.length > 0) {
        params.set('providers', providers.join(','));
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
  
  // Initial load
  useEffect(() => {
    fetchNews(0, selectedProviders);
  }, [selectedProviders]);
  
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
    router.replace(`/news?${params.toString()}`);
  };
  
  const handleLoadMore = () => {
    if (nextOffset !== null) {
      fetchNews(nextOffset, selectedProviders, false);
    }
  };
  
  const handleNewsClick = (item: NewsItem) => {
    // GA4 tracking
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'news_item_click', {
        sourceId: item.sourceId,
        url: item.url,
        title: item.title,
      });
    }
  };
  
  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }
  
  const groupedItems = groupItemsByDate(items);
  
  return (
    <div className={styles.content}>
      {/* Provider chips */}
      <div className={styles.filters}>
        <button
          className={`${styles.chip} ${selectedProviders.length === 0 ? styles.active : ''}`}
          onClick={() => {
            setSelectedProviders([]);
            const params = new URLSearchParams(searchParams);
            params.delete('providers');
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
      
      {/* News items grouped by date */}
      <div className={styles.newsGroups}>
        {Object.entries(groupedItems).map(([dateGroup, groupItems]) => (
          <div key={dateGroup} className={styles.dateGroup}>
            <h2 className={styles.dateHeader}>{dateGroup}</h2>
            <div className={styles.itemsList}>
              {groupItems.map(item => {
                const source = sources.find(s => s.id === item.sourceId);
                return (
                  <div key={item.id} className={styles.newsItem}>
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
  );
}