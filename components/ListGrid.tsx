import Link from 'next/link';
import Image from 'next/image';
import styles from './ListGrid.module.css';

interface ListItem {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  href: string;
  updatedAt?: string;
  topics?: string[];
  featured?: boolean;
  image?: string;
}

interface ListGridProps {
  items: ListItem[];
  showImage?: boolean;
  showTopics?: boolean;
  showDate?: boolean;
}

function TopicBadge({ topic }: { topic: string }) {
  return (
    <span className={styles.topicBadge}>
      {topic}
    </span>
  );
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      month: 'numeric', 
      day: 'numeric' 
    });
  } catch {
    return '';
  }
}

export default function ListGrid({ 
  items, 
  showImage = true, 
  showTopics = true, 
  showDate = true 
}: ListGridProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>コンテンツが見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Link 
          key={item.id} 
          href={item.href} 
          className={`${styles.card} ${item.featured ? styles.featured : ''}`}
        >
          {showImage && item.image && (
            <div className={styles.imageContainer}>
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={160}
                className={styles.image}
              />
            </div>
          )}
          
          <div className={styles.content}>
            {showTopics && item.topics && item.topics.length > 0 && (
              <div className={styles.topics}>
                {item.topics.slice(0, 2).map((topic) => (
                  <TopicBadge key={topic} topic={topic} />
                ))}
                {item.topics.length > 2 && (
                  <span className={styles.moreTopics}>
                    +{item.topics.length - 2}
                  </span>
                )}
              </div>
            )}
            
            <h3 className={styles.title}>{item.title}</h3>
            
            {item.excerpt && (
              <p className={styles.excerpt}>{item.excerpt}</p>
            )}
            
            <div className={styles.meta}>
              {showDate && item.updatedAt && (
                <span className={styles.date}>
                  {formatDate(item.updatedAt)}
                </span>
              )}
              
              <span className={styles.readMore}>
                詳細を見る →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}