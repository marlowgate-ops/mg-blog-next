'use client';

import Link from 'next/link';
import { gaEvent } from '@/lib/analytics';
import s from './Popular.module.css';

interface PopularItem {
  id: string;
  title: string;
  url: string;
  views: number;
}

interface PopularProps {
  items: PopularItem[];
}

export default function Popular({ items }: PopularProps) {
  const handleClick = (item: PopularItem) => {
    gaEvent('popular_click', {
      item_id: item.id,
      item_title: item.title,
      item_url: item.url
    });
  };

  if (!items.length) return null;

  return (
    <section className={s.popular}>
      <div className={s.header}>
        <h2 className={s.title}>Popular now</h2>
      </div>
      <div className={s.items}>
        {items.slice(0, 5).map((item, index) => (
          <Link
            key={item.id}
            href={item.url}
            className={s.item}
            onClick={() => handleClick(item)}
          >
            <span className={s.rank}>#{index + 1}</span>
            <span className={s.itemTitle}>{item.title}</span>
            <span className={s.views}>{item.views.toLocaleString()}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}