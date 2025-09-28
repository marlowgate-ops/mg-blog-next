'use client';
import { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import ProviderFilter from '@/components/ProviderFilter';
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

declare global {
  function gtag(command: 'event', eventName: string, parameters?: any): void;
}

export default function NewsClientWrapper({ initialItems, sources }: NewsClientWrapperProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  
  const filteredItems = selectedSource 
    ? initialItems.filter(item => item.source === selectedSource)
    : initialItems;

  const handleNewsClick = (item: NewsItem) => {
    // GA4 analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'news_item_click', {
        source: item.source,
        outlet_url: item.url,
        news_title: item.title
      });
    }
  };

  return (
    <div className={styles.content}>
      <ProviderFilter
        sources={sources}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
      />
      
      <div className={styles.grid}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <NewsCard
              key={item.id}
              title={item.title}
              url={item.url}
              source={item.source}
              publishedAt={item.publishedAt}
              onClick={() => handleNewsClick(item)}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <p>ニュースを読み込み中です...</p>
          </div>
        )}
      </div>
    </div>
  );
}