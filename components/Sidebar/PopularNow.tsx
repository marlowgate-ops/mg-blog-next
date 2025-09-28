'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { gaEvent } from '@/lib/analytics';
import styles from './PopularNow.module.css';

interface TopPageData {
  pathname: string;
  views: number;
  title?: string;
  lastViewed: string;
}

export default function PopularNow() {
  const [topPages, setTopPages] = useState<TopPageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPages() {
      try {
        const response = await fetch('/api/metrics/top?days=7&limit=5');
        if (response.ok) {
          const data = await response.json();
          setTopPages(data.pages || []);
        }
      } catch (error) {
        console.error('Error fetching top pages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPages();
  }, []);

  const handleClick = (item: TopPageData) => {
    gaEvent('popular_click', {
      pathname: item.pathname,
      title: item.title || item.pathname,
      views: item.views
    });
  };

  if (loading) {
    return (
      <section className={styles.popular}>
        <div className={styles.header}>
          <h3 className={styles.title}>人気記事</h3>
        </div>
        <div className={styles.loading}>
          読み込み中...
        </div>
      </section>
    );
  }

  if (topPages.length === 0) {
    return null;
  }

  return (
    <section className={styles.popular}>
      <div className={styles.header}>
        <h3 className={styles.title}>人気記事</h3>
        <Link href="/popular" className={styles.viewAll}>
          すべて見る →
        </Link>
      </div>
      <div className={styles.items}>
        {topPages.map((item, index) => (
          <Link
            key={item.pathname}
            href={item.pathname}
            className={styles.item}
            onClick={() => handleClick(item)}
          >
            <span className={styles.rank}>#{index + 1}</span>
            <div className={styles.content}>
              <span className={styles.itemTitle}>
                {item.title || item.pathname.split('/').pop() || 'Untitled'}
              </span>
              <span className={styles.views}>
                {item.views.toLocaleString()} views
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}