'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { gaEvent } from '@/lib/analytics';
import styles from './page.module.css';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsClientWrapperProps {
  initialItems: NewsItem[];
  sources: string[];
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes}分前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}日前`;
  }
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
      groupKey = itemDate.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric'
      });
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });
  
  return groups;
}

export default function NewsClientWrapper({ initialItems, sources }: NewsClientWrapperProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize selected sources from URL
  useEffect(() => {
    const sourcesParam = searchParams.get('sources');
    if (sourcesParam) {
      setSelectedSources(sourcesParam.split(','));
    }
  }, [searchParams]);
  
  const handleSourceToggle = (source: string) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source];
    
    setSelectedSources(newSources);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (newSources.length > 0) {
      params.set('sources', newSources.join(','));
    } else {
      params.delete('sources');
    }
    router.push(`/news?${params.toString()}`, { scroll: false });
    
    // Fetch filtered news
    fetchNews(newSources, 0, true);
  };
  
  const fetchNews = async (sources: string[] = selectedSources, offset: number = 0, replace: boolean = false) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.set('limit', '20');
      params.set('offset', offset.toString());
      if (sources.length > 0) {
        // Convert source names back to IDs for API
        const sourceMap: Record<string, string> = {
          'PRTimes': 'prtimes',
          'Kabutan': 'kabutan',
        };
        const sourceIds = sources.map(name => sourceMap[name] || name.toLowerCase()).filter(Boolean);
        params.set('sources', sourceIds.join(','));
      }
      
      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();
      
      if (replace) {
        setItems(data.items || []);
      } else {
        setItems(prev => [...prev, ...(data.items || [])]);
      }
      
      setNextOffset(data.nextOffset);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    if (nextOffset !== null) {
      fetchNews(selectedSources, nextOffset, false);
    }
  };
  
  const handleNewsClick = (item: NewsItem) => {
    gaEvent('news_item_click', {
      title: item.title,
      source: item.source,
      url: item.url
    });
  };
  
  const groupedItems = groupItemsByDate(items);
  
  return (
    <div className={styles.newsContent}>
      {/* Source Filter Chips */}
      <div className={styles.filters}>
        <h3 className={styles.filtersTitle}>情報源</h3>
        <div className={styles.chips}>
          {sources.map(source => (
            <button
              key={source}
              className={`${styles.chip} ${selectedSources.includes(source) ? styles.chipActive : ''}`}
              onClick={() => handleSourceToggle(source)}
            >
              {source}
            </button>
          ))}
        </div>
      </div>
      
      {/* News Items */}
      <div className={styles.newsItems}>
        {loading && items.length === 0 ? (
          <div className={styles.skeleton}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeletonItem} />
            ))}
          </div>
        ) : Object.keys(groupedItems).length === 0 ? (
          <div className={styles.empty}>
            <p>ニュースが見つかりませんでした</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([dateGroup, groupItems]) => (
            <div key={dateGroup} className={styles.dateGroup}>
              <h3 className={styles.dateHeader}>{dateGroup}</h3>
              <div className={styles.dateItems}>
                {groupItems.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.newsItem}
                    onClick={() => handleNewsClick(item)}
                  >
                    <div className={styles.itemMeta}>
                      <span className={styles.source}>{item.source}</span>
                      <span className={styles.time}>{formatRelativeTime(item.publishedAt)}</span>
                    </div>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
        
        {/* Load More Button */}
        {nextOffset !== null && (
          <button
            className={styles.loadMore}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? '読み込み中...' : 'さらに読み込む'}
          </button>
        )}
      </div>
    </div>
  );
}