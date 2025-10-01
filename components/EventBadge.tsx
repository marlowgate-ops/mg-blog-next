import { matchEventWithNews } from '@/lib/events/data';
import styles from './EventBadge.module.css';

interface EventBadgeProps {
  newsTitle: string;
  className?: string;
}

export default function EventBadge({ newsTitle, className = '' }: EventBadgeProps) {
  const relatedEvent = matchEventWithNews(newsTitle);
  
  if (!relatedEvent) {
    return null;
  }
  
  const isUpcoming = new Date(relatedEvent.date) > new Date();
  const isToday = new Date(relatedEvent.date).toDateString() === new Date().toDateString();
  
  return (
    <div className={`${styles.eventBadge} ${className}`}>
      <span className={styles.icon}>📅</span>
      <div className={styles.content}>
        <div className={styles.label}>
          {isToday ? '今日のイベント' : isUpcoming ? '関連イベント' : '関連イベント（終了）'}
        </div>
        <div className={styles.eventInfo}>
          <span className={styles.eventTitle}>{relatedEvent.title}</span>
          <span className={styles.eventDate}>
            {formatEventDate(relatedEvent.date, relatedEvent.time)}
          </span>
        </div>
      </div>
      {relatedEvent.importance === 'high' && (
        <span className={styles.importanceBadge}>重要</span>
      )}
    </div>
  );
}

function formatEventDate(date: string, time?: string): string {
  const eventDate = new Date(date);
  const today = new Date();
  const isToday = eventDate.toDateString() === today.toDateString();
  const isTomorrow = eventDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  if (isToday) {
    return time ? `今日 ${time}` : '今日';
  }
  
  if (isTomorrow) {
    return time ? `明日 ${time}` : '明日';
  }
  
  const month = eventDate.getMonth() + 1;
  const day = eventDate.getDate();
  const weekday = eventDate.toLocaleDateString('ja-JP', { weekday: 'short' });
  
  if (time) {
    return `${month}/${day}(${weekday}) ${time}`;
  }
  
  return `${month}/${day}(${weekday})`;
}