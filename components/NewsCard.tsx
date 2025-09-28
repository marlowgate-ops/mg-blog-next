import styles from './newscard.module.css';

interface NewsCardProps {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  onClick?: () => void;
}

export default function NewsCard({ title, url, source, publishedAt, onClick }: NewsCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}日前`;
    }
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.meta}>
        <span className={styles.source}>{source}</span>
        <span className={styles.divider}>•</span>
        <time className={styles.time}>{formatDate(publishedAt)}</time>
      </div>
      <h3 className={styles.title}>{title}</h3>
    </article>
  );
}