import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import topicsData from '@/config/topics.json';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'トピック一覧 | Marlow Gate',
  description: '金融・投資・保険に関するトピック一覧。カテゴリ別に整理された記事やガイドを探せます。',
  openGraph: {
    title: 'トピック一覧 | Marlow Gate',
    description: '金融・投資・保険に関するトピック一覧。',
    type: 'website',
    url: 'https://marlowgate.com/topics',
  },
  alternates: {
    canonical: 'https://marlowgate.com/topics',
  },
};

interface Topic {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export default function TopicsPage() {
  const topics = topicsData as Topic[];
  
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
      "numberOfItems": topics.length,
      "itemListElement": topics.map((topic, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Thing",
          "name": topic.label,
          "description": topic.description,
          "url": `https://marlowgate.com/topics/${topic.id}`
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

        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <Link 
              key={topic.id} 
              href={`/topics/${topic.id}`}
              className={styles.topicCard}
            >
              <div className={styles.topicIcon}>{topic.icon}</div>
              <h2 className={styles.topicTitle}>{topic.label}</h2>
              <p className={styles.topicDescription}>{topic.description}</p>
              <div className={styles.topicArrow}>→</div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}