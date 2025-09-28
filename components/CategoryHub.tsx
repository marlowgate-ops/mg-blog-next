'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import s from './CategoryHub.module.css';

interface CategoryItem {
  label: string;
  href: string;
  icon?: string;
}

const categories: CategoryItem[] = [
  { label: 'News', href: '/news', icon: '📰' },
  { label: 'Guides', href: '/guides', icon: '📚' },
  { label: 'Reviews', href: '/reviews', icon: '⭐' },
  { label: 'Comparisons', href: '/best', icon: '⚖️' },
  { label: 'Insurance', href: '/best/insurance', icon: '🛡️' },
];

interface CategoryHubProps {
  onCategoryClick?: (category: string, href: string) => void;
}

export default function CategoryHub({ onCategoryClick }: CategoryHubProps) {
  const pathname = usePathname();

  const handleClick = (category: string, href: string) => {
    if (onCategoryClick) {
      onCategoryClick(category, href);
    }
  };

  return (
    <section className={s.categoryHub}>
      <div className={s.categories}>
        {categories.map((category) => {
          const isActive = pathname === category.href || 
            (category.href !== '/' && pathname.startsWith(category.href));
          
          return (
            <Link
              key={category.href}
              href={category.href}
              className={`${s.categoryItem} ${isActive ? s.active : ''}`}
              onClick={() => handleClick(category.label, category.href)}
            >
              {category.icon && <span className={s.icon}>{category.icon}</span>}
              <span className={s.label}>{category.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}