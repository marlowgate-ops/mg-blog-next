import Link from 'next/link';
import styles from './RelatedContent.module.css';

interface RelatedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  featured?: boolean;
  category?: string;
  rating?: number;
  score?: number;
}

interface RelatedContentProps {
  title: string;
  items: RelatedItem[];
  type: 'guides' | 'tools' | 'brokers' | 'insurance' | 'posts' | 'topics';
  showViewAll?: boolean;
  viewAllUrl?: string;
  className?: string;
}

export default function RelatedContent({
  title,
  items,
  type,
  showViewAll = false,
  viewAllUrl,
  className = ''
}: RelatedContentProps) {
  if (items.length === 0) {
    return null;
  }

  const getIcon = (itemType: RelatedContentProps['type']) => {
    switch (itemType) {
      case 'guides': return '📚';
      case 'tools': return '🛠️';
      case 'brokers': return '🏦';
      case 'insurance': return '🛡️';
      case 'posts': return '📰';
      case 'topics': return '🏷️';
      default: return '📝';
    }
  };

  return (
    <section className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>{getIcon(type)}</span>
          {title}
        </h2>
        {showViewAll && viewAllUrl && (
          <Link href={viewAllUrl} className={styles.viewAll}>
            すべて見る →
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className={`${styles.card} ${item.featured ? styles.featured : ''}`}
          >
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
              
              {(item.rating || item.score) && (
                <div className={styles.cardMeta}>
                  {item.rating && (
                    <span className={styles.rating}>
                      {'★'.repeat(Math.floor(item.rating))} {item.rating.toFixed(1)}
                    </span>
                  )}
                  {item.score && (
                    <span className={styles.score}>
                      スコア: {item.score.toFixed(1)}
                    </span>
                  )}
                  {item.category && (
                    <span className={styles.category}>{item.category}</span>
                  )}
                </div>
              )}
            </div>
            
            {item.featured && (
              <div className={styles.featuredBadge}>
                おすすめ
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}