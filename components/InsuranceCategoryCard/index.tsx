import Link from 'next/link';
import { BookmarkButton } from '@/components/BookmarkButton';
import styles from './InsuranceCategoryCard.module.css';

interface InsuranceCategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  features: string[];
  avgPrice?: string;
  companies?: number;
  popular?: boolean;
  className?: string;
}

export function InsuranceCategoryCard({
  title,
  description,
  href,
  icon,
  color,
  features,
  avgPrice,
  companies,
  popular = false,
  className = ''
}: InsuranceCategoryCardProps) {
  return (
    <div 
      className={`${styles.card} ${popular ? styles.popular : ''} ${className}`}
      style={{ '--card-color': color } as React.CSSProperties}
    >
      {popular && (
        <div className={styles.popularBadge}>
          <span>人気</span>
        </div>
      )}
      
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>{icon}</div>
        <div className={styles.cardMeta}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDescription}>{description}</p>
        </div>
        <BookmarkButton
          item={{
            url: href,
            title: `${title}比較`,
            type: 'insurance',
            description: description,
            tags: [title, '保険', '比較']
          }}
          variant="icon-only"
          className={styles.bookmark}
        />
      </div>

      <div className={styles.cardStats}>
        {avgPrice && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>平均保険料</span>
            <span className={styles.statValue}>{avgPrice}</span>
          </div>
        )}
        {companies && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>取扱社数</span>
            <span className={styles.statValue}>{companies}社</span>
          </div>
        )}
      </div>

      <div className={styles.cardFeatures}>
        <ul className={styles.featureList}>
          {features.slice(0, 3).map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <span className={styles.featureIcon}>✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.cardActions}>
        <Link href={href} className={styles.primaryAction}>
          比較表を見る
        </Link>
        <Link href={`${href}#guide`} className={styles.secondaryAction}>
          選び方ガイド
        </Link>
      </div>
    </div>
  );
}