import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllTopicHubs, getFeaturedTopicHubs } from '@/lib/topics/hubs';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'トピック一覧 | Marlow Gate',
  description: '金融・投資・保険に関するトピック一覧。カテゴリ別に整理された記事やガイドを探せます。',
  openGraph: {
    title: 'トピック一覧 | Marlow Gate',
    description: '金融・投資・保険に関するトピック一覧。カテゴリ別に整理された記事やガイドを探せます。',
    type: 'website',
    url: 'https://marlowgate.com/topics',
  },
  alternates: {
    canonical: 'https://marlowgate.com/topics',
  },
};

export default function TopicsPage() {
  const allHubs = getAllTopicHubs();
  const featuredHubs = getFeaturedTopicHubs();
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'トピック' }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "トピック一覧",
    "description": "金融・投資・保険に関するトピック一覧",
    "url": "https://marlowgate.com/topics",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allHubs.length,
      "itemListElement": allHubs.map((hub, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Thing",
          "name": hub.title,
          "description": hub.description,
          "url": `https://marlowgate.com/topics/${hub.id}`
        }
      }))
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>トピック一覧</h1>
          <p className={styles.description}>
            金融・投資・保険に関する様々なトピックから、興味のある分野を見つけてください。
          </p>
        </div>

        {/* Featured Topics */}
        {featuredHubs.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>注目のトピック</h2>
            <div className={styles.featuredGrid}>
              {featuredHubs.map((hub) => (
                <Link 
                  key={hub.id} 
                  href={`/topics/${hub.id}`}
                  className={`${styles.topicCard} ${styles.featured}`}
                >
                  <div className={styles.topicIcon}>{hub.icon}</div>
                  <h3 className={styles.topicTitle}>{hub.title}</h3>
                  <p className={styles.topicDescription}>{hub.description}</p>
                  <div className={styles.topicArrow}>→</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Topics */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>すべてのトピック</h2>
          <div className={styles.topicsGrid}>
            {allHubs.map((hub) => (
              <Link 
                key={hub.id} 
                href={`/topics/${hub.id}`}
                className={styles.topicCard}
              >
                <div className={styles.topicIcon}>{hub.icon}</div>
                <h3 className={styles.topicTitle}>{hub.title}</h3>
                <p className={styles.topicDescription}>{hub.description}</p>
                <div className={styles.topicMeta}>
                  <span className={styles.topicCategory}>{getCategoryLabel(hub.category)}</span>
                  <div className={styles.topicArrow}>→</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    forex: 'FX・外国為替',
    investment: '投資',
    insurance: '保険',
    trading: '取引・トレード',
    education: '教育・学習'
  };
  return labels[category] || category;
}