// components/MarketTicker.tsx
'use client';
import { useEffect, useState } from 'react';
import { MarketData } from '@/lib/market-data';
import styles from './MarketTicker.module.css';

interface MarketTickerProps {
  initialData?: MarketData | null;
  limit?: number;
  showTitle?: boolean;
}

export default function MarketTicker({ initialData = null, limit = 5, showTitle = true }: MarketTickerProps) {
  const [data, setData] = useState<MarketData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const response = await fetch('/api/market-data');
        if (!response.ok) throw new Error('Failed to fetch market data');
        
        const marketData = await response.json();
        if (mounted) {
          setData(marketData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load market data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (!initialData) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [initialData]);

  if (loading) {
    return <MarketTickerSkeleton limit={limit} showTitle={showTitle} />;
  }

  if (error || !data) {
    return <MarketTickerError showTitle={showTitle} />;
  }

  const allItems = [
    ...data.fx.map(item => ({
      type: 'fx' as const,
      symbol: item.symbol,
      name: item.symbol,
      value: item.rate,
      change: item.change,
      changePercent: item.changePercent,
    })),
    ...data.indices.map(item => ({
      type: 'index' as const,
      symbol: item.symbol,
      name: item.name,
      value: item.value,
      change: item.change,
      changePercent: item.changePercent,
    })),
  ].slice(0, limit);

  return (
    <div className={styles.container} aria-live="polite" aria-label="Market data ticker">
      {showTitle && (
        <h3 className={styles.title}>リアルタイム市況</h3>
      )}
      <div className={styles.ticker}>
        {allItems.map((item, index) => (
          <div key={`${item.symbol}-${index}`} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.symbol}>{item.symbol}</span>
              <span className={styles.name}>{item.name}</span>
            </div>
            <div className={styles.itemData}>
              <span className={styles.value}>
                {item.type === 'fx' ? item.value.toFixed(2) : item.value.toLocaleString()}
              </span>
              <span className={`${styles.change} ${item.changePercent >= 0 ? styles.positive : styles.negative}`}>
                {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.timestamp}>
        最終更新: {new Date(data.lastUpdated).toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
}

function MarketTickerSkeleton({ limit, showTitle }: { limit: number; showTitle: boolean }) {
  return (
    <div className={styles.container} aria-label="Loading market data">
      {showTitle && (
        <h3 className={styles.title}>リアルタイム市況</h3>
      )}
      <div className={styles.ticker}>
        {Array.from({ length: limit }, (_, index) => (
          <div key={index} className={`${styles.item} ${styles.skeleton}`}>
            <div className={styles.itemHeader}>
              <span className={`${styles.symbol} ${styles.skeletonText}`}></span>
              <span className={`${styles.name} ${styles.skeletonText}`}></span>
            </div>
            <div className={styles.itemData}>
              <span className={`${styles.value} ${styles.skeletonText}`}></span>
              <span className={`${styles.change} ${styles.skeletonText}`}></span>
            </div>
          </div>
        ))}
      </div>
      <div className={`${styles.timestamp} ${styles.skeletonText}`}></div>
    </div>
  );
}

function MarketTickerError({ showTitle }: { showTitle: boolean }) {
  return (
    <div className={styles.container} aria-label="Market data unavailable">
      {showTitle && (
        <h3 className={styles.title}>リアルタイム市況</h3>
      )}
      <div className={styles.error}>
        <span className={styles.errorIcon}>⚠️</span>
        <span className={styles.errorText}>市況データを取得できませんでした</span>
      </div>
    </div>
  );
}