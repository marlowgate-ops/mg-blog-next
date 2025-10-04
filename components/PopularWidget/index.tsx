'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PopularItem, PopularRange } from '@/lib/metrics/popular';
import styles from './PopularWidget.module.css';

interface PopularWidgetProps {
  className?: string;
  showTitle?: boolean;
  limit?: number;
}

export function PopularWidget({ 
  className = '', 
  showTitle = true, 
  limit = 10 
}: PopularWidgetProps) {
  const [items, setItems] = useState<PopularItem[]>([]);
  const [range, setRange] = useState<PopularRange>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPopular() {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(`/api/popular?range=${range}&limit=${limit}`);
        
        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
        } else {
          setError(true);
        }
      } catch (err) {
        console.warn('Failed to fetch popular items:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPopular();
  }, [range, limit]);

  // Hide widget if KV is not available or error occurred
  if (error && items.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.widget} ${className}`}>
      {showTitle && (
        <div className={styles.header}>
          <h3 className={styles.title}>よく読まれている</h3>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${range === 'week' ? styles.active : ''}`}
              onClick={() => setRange('week')}
              aria-pressed={range === 'week'}
            >
              週間
            </button>
            <button
              className={`${styles.tab} ${range === 'month' ? styles.active : ''}`}
              onClick={() => setRange('month')}
              aria-pressed={range === 'month'}
            >
              月間
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.content}>
        {loading && items.length === 0 ? (
          <div className={styles.skeleton}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeletonItem} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <ol className={styles.list}>
            {items.map((item) => (
              <li key={item.slug} className={styles.item}>
                <Link href={item.url} className={styles.link}>
                  <span className={styles.rank}>{item.rank}</span>
                  <div className={styles.content}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <div className={styles.meta}>
                      <span className={styles.type}>{getTypeLabel(item.type)}</span>
                      <span className={styles.views}>{item.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.empty}>
            <p>まだデータがありません</p>
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className={styles.footer}>
          <Link href="/popular" className={styles.seeAll}>
            すべて見る →
          </Link>
        </div>
      )}
    </div>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    article: '記事',
    news: 'ニュース',
    broker: 'ブローカー',
    insurance: '保険'
  };
  return labels[type] || type;
}