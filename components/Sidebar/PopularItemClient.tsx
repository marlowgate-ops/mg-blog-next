'use client';

import Link from 'next/link';
import styles from './PopularNow.module.css';

interface PopularItem {
  path: string;
  score: number;
}

interface PopularItemClientProps {
  item: PopularItem;
  index: number;
  title: string;
}

export default function PopularItemClient({ item, index, title }: PopularItemClientProps) {
  const handleClick = () => {
    // GA4 event tracking
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'popular_click', {
        title: title,
        href: item.path,
        rank: index + 1,
      });
    }
  };

  return (
    <Link
      href={item.path}
      className={styles.item}
      onClick={handleClick}
    >
      <span className={styles.rank}>#{index + 1}</span>
      <div className={styles.content}>
        <span className={styles.itemTitle}>
          {title}
        </span>
        <span className={styles.views}>
          {item.score} views
        </span>
      </div>
    </Link>
  );
}