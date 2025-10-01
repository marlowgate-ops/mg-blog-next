import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  getEventsCalendar, 
  eventCategories, 
  getFeaturedEvents,
  getCurrentWeekEvents 
} from '@/lib/events/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '金融・保険イベントカレンダー | MarlowtGate',
  description: 'FOMC、日銀会合、経済指標発表、保険締切など重要な金融・保険イベントのカレンダー。ICS形式でのエクスポートも可能。',
  keywords: ['金融カレンダー', 'FOMC', '日銀', '経済指標', '保険締切', 'イベント'],
  openGraph: {
    title: '金融・保険イベントカレンダー',
    description: '重要な金融・保険イベントを一覧で確認',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function EventsPage() {
  const calendar = getEventsCalendar();
  const featuredEvents = getFeaturedEvents();
  const currentWeek = getCurrentWeekEvents();
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'イベントカレンダー' }
  ];

  // JSON-LD for current week events
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "name": "金融・保険イベントカレンダー",
    "description": "重要な金融・保険関連イベントの週間スケジュール",
    "url": "https://marlowgate.com/events",
    "organizer": {
      "@type": "Organization",
      "name": "MarlowtGate",
      "url": "https://marlowgate.com"
    },
    "event": currentWeek.events.map(event => ({
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": event.time 
        ? `${event.date}T${event.time}:00+09:00`
        : event.date,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": getLocationByCountry(event.country)
      },
      "organizer": {
        "@type": "Organization",
        "name": event.source
      }
    }))
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.icon}>📅</span>
            金融・保険イベントカレンダー
          </h1>
          <p className={styles.description}>
            FOMC、日銀会合、経済指標発表、保険締切など重要なイベントをチェック
          </p>
          
          <div className={styles.actions}>
            <a 
              href="/events.ics" 
              className={styles.exportButton}
              download="financial-events.ics"
            >
              📄 カレンダーをエクスポート (.ics)
            </a>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>注目のイベント</h2>
            <div className={styles.featuredGrid}>
              {featuredEvents.slice(0, 4).map(event => (
                <div key={event.id} className={styles.featuredCard}>
                  <div className={styles.eventCategory}>
                    <span className={styles.categoryIcon}>
                      {getCategoryIcon(event.category)}
                    </span>
                    <span className={styles.categoryName}>
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <div className={styles.eventDate}>
                    <span className={styles.date}>
                      {formatEventDate(event.date, event.time)}
                    </span>
                    <span className={styles.importance}>
                      {getImportanceBadge(event.importance)}
                    </span>
                  </div>
                  <p className={styles.eventDescription}>{event.description}</p>
                  {event.url && (
                    <a 
                      href={event.url} 
                      className={styles.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      詳細を見る →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Current Week */}
        {currentWeek.events.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>今週のイベント</h2>
            <div className={styles.weekView}>
              <div className={styles.weekHeader}>
                <span className={styles.weekDates}>
                  {formatWeekRange(currentWeek.weekStart, currentWeek.weekEnd)}
                </span>
                <a 
                  href="/events.ics?period=7" 
                  className={styles.miniExport}
                  download="this-week-events.ics"
                >
                  今週をエクスポート
                </a>
              </div>
              <div className={styles.eventsList}>
                {currentWeek.events.map(event => (
                  <EventListItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Next Week */}
        {calendar.nextWeek.events.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>来週のイベント</h2>
            <div className={styles.weekView}>
              <div className={styles.weekHeader}>
                <span className={styles.weekDates}>
                  {formatWeekRange(calendar.nextWeek.weekStart, calendar.nextWeek.weekEnd)}
                </span>
              </div>
              <div className={styles.eventsList}>
                {calendar.nextWeek.events.map(event => (
                  <EventListItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>イベントカテゴリー</h2>
          <div className={styles.categoriesGrid}>
            {eventCategories.map(category => (
              <div key={category.id} className={styles.categoryCard}>
                <div 
                  className={styles.categoryHeader}
                  style={{ backgroundColor: category.color }}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                </div>
                <p className={styles.categoryDescription}>{category.description}</p>
                <a 
                  href={`/events.ics?category=${category.id}`}
                  className={styles.categoryExport}
                  download={`${category.id}-events.ics`}
                >
                  このカテゴリーをエクスポート
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>今後のイベント</h2>
          <div className={styles.upcomingList}>
            {calendar.upcoming.map(event => (
              <EventListItem key={event.id} event={event} showDate={true} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

// Helper Components
function EventListItem({ event, showDate = false }: { event: any; showDate?: boolean }) {
  return (
    <div className={styles.eventItem}>
      <div className={styles.eventTime}>
        {showDate && (
          <div className={styles.eventDateFull}>
            {formatEventDate(event.date, event.time)}
          </div>
        )}
        {!showDate && event.time && (
          <div className={styles.eventTimeOnly}>
            {event.time}
          </div>
        )}
        <div className={styles.eventTimezone}>
          {event.timezone}
        </div>
      </div>
      <div className={styles.eventContent}>
        <div className={styles.eventMeta}>
          <span className={styles.eventCategory}>
            {getCategoryIcon(event.category)}
            {getCategoryName(event.category)}
          </span>
          <span className={styles.eventImportance}>
            {getImportanceBadge(event.importance)}
          </span>
        </div>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDescription}>{event.description}</p>
        {event.url && (
          <a 
            href={event.url}
            className={styles.eventLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            詳細を見る
          </a>
        )}
      </div>
    </div>
  );
}

// Helper Functions
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'monetary-policy': '🏦',
    'economic-data': '📊',
    'insurance-deadline': '🛡️',
    'earnings': '📈',
    'regulation': '⚖️',
    'market-holiday': '🏖️'
  };
  return icons[category] || '📅';
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    'monetary-policy': '金融政策',
    'economic-data': '経済指標',
    'insurance-deadline': '保険締切',
    'earnings': '決算発表',
    'regulation': '規制発表',
    'market-holiday': '市場休場'
  };
  return names[category] || category;
}

function getImportanceBadge(importance: string): string {
  const badges: Record<string, string> = {
    'high': '🔴 重要',
    'medium': '🟡 中程度',
    'low': '🟢 軽微'
  };
  return badges[importance] || importance;
}

function formatEventDate(date: string, time?: string): string {
  const eventDate = new Date(date);
  const weekday = eventDate.toLocaleDateString('ja-JP', { weekday: 'short' });
  const dateStr = eventDate.toLocaleDateString('ja-JP', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  if (time) {
    return `${dateStr}(${weekday}) ${time}`;
  }
  return `${dateStr}(${weekday})`;
}

function formatWeekRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = start.toLocaleDateString('ja-JP', { 
    month: 'short', 
    day: 'numeric' 
  });
  const endStr = end.toLocaleDateString('ja-JP', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `${startStr} - ${endStr}`;
}

function getLocationByCountry(country: string): string {
  const locations: Record<string, string> = {
    'JP': '日本',
    'US': 'アメリカ',
    'EU': 'ヨーロッパ',
    'GB': 'イギリス',
    'GLOBAL': 'グローバル'
  };
  return locations[country] || country;
}