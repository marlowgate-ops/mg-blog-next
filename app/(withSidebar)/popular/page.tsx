import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import topicsData from '@/config/topics.json';
import styles from './page.module.css';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '人気記事・ランキング | Marlow Gate',
  description: '最も読まれている記事やガイドをランキング形式で紹介。人気の投資・保険・金融情報をチェックしましょう。',
  openGraph: {
    title: '人気記事・ランキング | Marlow Gate',
    description: '最も読まれている記事やガイドをランキング形式で紹介。',
    type: 'website',
    url: 'https://marlowgate.com/popular',
  },
  alternates: {
    canonical: 'https://marlowgate.com/popular',
  },
};

interface TopPageData {
  pathname: string;
  views: number;
  title?: string;
  lastViewed: string;
}

interface Topic {
  id: string;
  label: string;
  icon: string;
}

async function getTopPages(): Promise<TopPageData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/metrics/top?days=30&limit=20`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.pages || [];
  } catch (error) {
    console.error('Error fetching top pages:', error);
    return [];
  }
}

// Helper to get topic from pathname
function getTopicFromPath(pathname: string): string | null {
  // Direct pathname matching without needing topics data
  if (pathname.includes('/forex') || pathname.includes('/fx')) return 'forex';
  if (pathname.includes('/insurance')) return 'insurance';
  if (pathname.includes('/stock')) return 'stocks';
  if (pathname.includes('/crypto')) return 'crypto';
  if (pathname.includes('/banking')) return 'banking';
  if (pathname.includes('/tools')) return 'tools';
  if (pathname.includes('/news')) return 'news';
  
  return null;
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

export default async function PopularPage() {
  const topPages = await getTopPages();
  const topics = topicsData as Topic[];
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: '人気記事' }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "人気記事・ランキング",
    "description": "最も読まれている記事やガイドをランキング形式で紹介",
    "url": "https://marlowgate.com/popular",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": topPages.length,
      "itemListElement": topPages.map((page, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": page.title || page.pathname,
          "url": `https://marlowgate.com${page.pathname}`,
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ReadAction",
            "userInteractionCount": page.views
          }
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
          <h1 className={styles.title}>人気記事・ランキング</h1>
          <p className={styles.description}>
            最も読まれている記事やガイドを、アクセス数に基づいてランキング形式で紹介しています。
          </p>
        </div>

        {topPages.length === 0 ? (
          <div className={styles.empty}>
            <p>人気記事データを読み込み中です...</p>
          </div>
        ) : (
          <div className={styles.rankingList}>
            {topPages.map((page, index) => {
              const topicId = getTopicFromPath(page.pathname);
              const topic = topicId ? topics.find(t => t.id === topicId) : null;
              
              return (
                <Link 
                  key={page.pathname} 
                  href={page.pathname}
                  className={`${styles.rankingItem} ${index < 3 ? styles.topThree : ''}`}
                >
                  <div className={styles.rank}>
                    <span className={`${styles.rankNumber} ${styles[`rank${index + 1}`]}`}>
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className={styles.content}>
                    <div className={styles.itemHeader}>
                      {topic && (
                        <span className={styles.topicBadge}>
                          <span className={styles.topicIcon}>{topic.icon}</span>
                          {topic.label}
                        </span>
                      )}
                      <span className={styles.views}>
                        {page.views.toLocaleString()} views
                      </span>
                    </div>
                    
                    <h2 className={styles.itemTitle}>
                      {page.title || page.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Untitled'}
                    </h2>
                    
                    <div className={styles.itemMeta}>
                      <span className={styles.path}>{page.pathname}</span>
                      <span className={styles.lastViewed}>
                        最終アクセス: {formatDate(page.lastViewed)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.arrow}>→</div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}