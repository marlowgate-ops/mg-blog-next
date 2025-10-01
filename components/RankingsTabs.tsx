'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import type { RankingItem, PopularContent } from '@/lib/rankings/types';
import s from './RankingsTabs.module.css';

interface RankingsTabsProps {
  activeTab: string;
  activeWindow: '24h' | '7d';
}

const tabs = [
  { id: 'popular', label: '人気', icon: '🔥' },
  { id: 'news', label: 'ニュース', icon: '📰' },
  { id: 'brokers', label: 'ブローカー', icon: '💰' },
  { id: 'insurance', label: '保険', icon: '🛡️' },
  { id: 'posts', label: '記事', icon: '📝' },
  { id: 'tools', label: 'ツール', icon: '🔧' },
  { id: 'tags', label: 'タグ', icon: '🏷️' }
];

const windows = [
  { id: '24h', label: '24時間' },
  { id: '7d', label: '7日間' }
];

// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch rankings data');
  }
  return response.json();
};

export default function RankingsTabs({ activeTab, activeWindow }: RankingsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // SWR data fetching with cache
  const { data, error, isLoading, mutate } = useSWR(
    `/api/rankings?window=${activeWindow}&type=${activeTab === 'popular' ? 'all' : activeTab}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      dedupingInterval: 60 * 1000, // Dedupe requests within 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 3000
    }
  );

  // Update URL with new tab/window
  const updateUrl = useCallback((newTab: string, newWindow: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', newTab);
    params.set('window', newWindow);
    router.push(`/rankings?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleTabChange = (tabId: string) => {
    updateUrl(tabId, activeWindow);
  };

  const handleWindowChange = (windowId: '24h' | '7d') => {
    updateUrl(activeTab, windowId);
  };

  const handleRefresh = () => {
    mutate();
  };

  if (!isClient) {
    return <RankingsTabsSkeleton />;
  }

  return (
    <div className={s.rankingsTabs}>
      {/* Tab Navigation */}
      <nav className={s.tabNav} role="tablist" aria-label="ランキングカテゴリー">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={`${s.tabButton} ${activeTab === tab.id ? s.active : ''}`}
          >
            <span className={s.tabIcon} aria-hidden="true">{tab.icon}</span>
            <span className={s.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Window Selector */}
      <div className={s.windowSelector}>
        <span className={s.windowLabel}>期間:</span>
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => handleWindowChange(window.id as '24h' | '7d')}
            className={`${s.windowButton} ${activeWindow === window.id ? s.active : ''}`}
            aria-pressed={activeWindow === window.id}
          >
            {window.label}
          </button>
        ))}
        <button
          onClick={handleRefresh}
          className={s.refreshButton}
          aria-label="データを更新"
          title="データを更新"
        >
          🔄
        </button>
      </div>

      {/* Content Area */}
      <div className={s.contentArea}>
        {error && (
          <div className={s.errorState}>
            <p>データの読み込みに失敗しました。</p>
            <button onClick={handleRefresh} className={s.retryButton}>
              再試行
            </button>
          </div>
        )}

        {isLoading && <RankingsList items={[]} isLoading={true} />}

        {data && !error && (
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === 'popular' ? (
              <PopularContentView data={data.data} />
            ) : (
              <RankingsList items={data.data.items || []} isLoading={false} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Popular content view with multiple categories
function PopularContentView({ data }: { data: PopularContent }) {
  if (!data) return null;

  return (
    <div className={s.popularContent}>
      <div className={s.popularGrid}>
        {Object.entries(data).map(([category, items]) => (
          <div key={category} className={s.popularSection}>
            <h3 className={s.sectionTitle}>
              {getCategoryLabel(category)}
            </h3>
            <div className={s.sectionItems}>
              {items.slice(0, 5).map((item: RankingItem, index: number) => (
                <PopularItem
                  key={item.id}
                  item={item}
                  rank={index + 1}
                  compact={true}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Rankings list view
function RankingsList({ items, isLoading }: { items: RankingItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className={s.rankingsList}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={s.rankingItemSkeleton}>
            <div className={s.rankSkeleton} />
            <div className={s.contentSkeleton}>
              <div className={s.titleSkeleton} />
              <div className={s.metaSkeleton} />
            </div>
            <div className={s.scoreSkeleton} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={s.rankingsList}>
      {items.map((item, index) => (
        <RankingItem
          key={item.id}
          item={item}
          rank={index + 1}
        />
      ))}
    </div>
  );
}

// Individual ranking item
function RankingItem({ item, rank }: { item: RankingItem; rank: number }) {
  const handleClick = () => {
    // Track click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ranking_item_click', {
        item_id: item.id,
        item_name: item.title,
        item_category: item.type,
        rank_position: rank
      });
    }
  };

  return (
    <article className={s.rankingItem} onClick={handleClick}>
      <div className={s.rankNumber}>
        <span>{rank}</span>
      </div>
      
      <div className={s.itemContent}>
        <h3 className={s.itemTitle}>
          <a href={item.url}>{item.title}</a>
        </h3>
        
        {item.excerpt && (
          <p className={s.itemExcerpt}>{item.excerpt}</p>
        )}
        
        <div className={s.itemMeta}>
          {item.category && (
            <span className={s.category}>{item.category}</span>
          )}
          {item.provider && (
            <span className={s.provider}>{item.provider}</span>
          )}
          <time className={s.lastUpdated}>
            {formatDate(item.lastUpdated)}
          </time>
        </div>
      </div>
      
      <div className={s.itemScore}>
        <div className={s.scoreValue}>{item.score}</div>
        <div className={s.scoreLabel}>スコア</div>
        <div className={s.views}>{formatNumber(item.views)} views</div>
      </div>
    </article>
  );
}

// Compact popular item for grid view
function PopularItem({ item, rank, compact }: { item: RankingItem; rank: number; compact: boolean }) {
  return (
    <article className={`${s.popularItem} ${compact ? s.compact : ''}`}>
      <div className={s.rankBadge}>{rank}</div>
      <div className={s.itemContent}>
        <h4 className={s.itemTitle}>
          <a href={item.url}>{item.title}</a>
        </h4>
        <div className={s.itemScore}>
          {item.score} <span className={s.scoreUnit}>pt</span>
        </div>
      </div>
    </article>
  );
}

// Skeleton component for loading states
function RankingsTabsSkeleton() {
  return (
    <div className={s.rankingsTabs}>
      <div className={s.tabNavSkeleton}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={s.tabButtonSkeleton} />
        ))}
      </div>
      <div className={s.windowSelectorSkeleton}>
        <div className={s.windowButtonSkeleton} />
        <div className={s.windowButtonSkeleton} />
      </div>
      <div className={s.contentAreaSkeleton}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={s.rankingItemSkeleton} />
        ))}
      </div>
    </div>
  );
}

// Utility functions
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    news: 'ニュース',
    brokers: 'ブローカー',
    insurance: '保険',
    posts: '記事',
    tools: 'ツール',
    tags: 'タグ'
  };
  return labels[category] || category;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return '数分前';
  if (diffInHours < 24) return `${diffInHours}時間前`;
  if (diffInHours < 48) return '昨日';
  
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  });
}

function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return `${Math.floor(num / 100) / 10}k`;
  return `${Math.floor(num / 1000)}k`;
}