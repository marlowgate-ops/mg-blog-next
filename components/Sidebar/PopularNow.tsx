import { Suspense } from 'react';
import Link from 'next/link';
import PopularItemClient from './PopularItemClient';
import styles from './PopularNow.module.css';
import popularFallback from '@/config/popular.json';

interface PopularItem {
  path: string;
  score: number;
}

interface PopularResponse {
  items: PopularItem[];
  fallback?: boolean;
}

async function fetchPopularPages(): Promise<PopularItem[]> {
  try {
    // For server-side rendering, use fallback data immediately
    // API calls during build should be avoided for better performance
    console.log('Using fallback popular data during server-side rendering');
  } catch (error) {
    console.error('Error fetching popular pages:', error);
  }
  
  // Use static popular items as the reliable fallback
  return popularFallback.slice(0, 10).map((item, index) => ({
    path: item.url,
    score: popularFallback.length - index,
  }));
}

function getDisplayTitle(path: string): string {
  // Map common paths to readable titles
  const titleMap: Record<string, string> = {
    '/best/forex-brokers-jp': 'FX業者比較',
    '/best/insurance': '保険比較',
    '/guides': 'ガイド記事', 
    '/reviews': 'レビュー',
    '/topics': 'トピック一覧',
    '/blog': 'ブログ',
    '/best': '比較ランキング',
    '/search': 'サイト内検索',
    '/about': 'About',
    '/contact': 'お問い合わせ',
    '/best/low-spread': '低スプレッド業者',
    '/best/tools': '取引ツール比較',
  };
  
  return titleMap[path] || path.split('/').filter(Boolean).pop() || path;
}

async function PopularNowContent() {
  const items = await fetchPopularPages();
  
  if (items.length === 0) {
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
        {items.slice(0, 5).map((item, index) => (
          <PopularItemClient 
            key={item.path} 
            item={item} 
            index={index} 
            title={getDisplayTitle(item.path)}
          />
        ))}
      </div>
    </section>
  );
}

function PopularNowLoading() {
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

export default function PopularNow() {
  return (
    <Suspense fallback={<PopularNowLoading />}>
      <PopularNowContent />
    </Suspense>
  );
}