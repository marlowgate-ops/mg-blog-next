import { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@/components/Container';
import Breadcrumbs from '@/components/Breadcrumbs';
import RankingsTabs from '@/components/RankingsTabs';
import JsonLd from '@/components/JsonLd';
import styles from './rankings.module.css';

export const metadata: Metadata = {
  title: 'ランキング・人気コンテンツ | mg-blog-next',
  description: '24時間・7日間の人気ニュース、ブローカー、保険、記事、ツールのランキングをご覧ください。',
  openGraph: {
    title: 'ランキング・人気コンテンツ | mg-blog-next',
    description: '24時間・7日間の人気ニュース、ブローカー、保険、記事、ツールのランキングをご覧ください。',
    type: 'website',
    url: '/rankings'
  },
  alternates: {
    canonical: '/rankings'
  }
};

interface RankingsPageProps {
  searchParams: {
    tab?: string;
    window?: '24h' | '7d';
  };
}

export default function RankingsPage({ searchParams }: RankingsPageProps) {
  const activeTab = searchParams.tab || 'popular';
  const activeWindow = searchParams.window || '24h';

  const breadcrumbItems = [
    { name: 'ホーム', href: '/' },
    { name: 'ランキング', href: '/rankings' }
  ];

  // JSON-LD for ItemList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ランキング・人気コンテンツ',
    description: '金融・FX・保険に関する人気コンテンツのランキング',
    url: 'https://mg-blog-next.vercel.app/rankings',
    numberOfItems: 20,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '人気ニュース',
        description: '24時間・7日間で最も読まれた金融ニュース'
      },
      {
        '@type': 'ListItem', 
        position: 2,
        name: '人気ブローカー',
        description: '最もアクセスされたFXブローカー・証券会社'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '人気保険',
        description: '注目を集めている保険商品'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: '人気記事',
        description: '読者に最も読まれているガイド記事'
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: '人気ツール',
        description: '利用頻度の高い計算ツール'
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: '人気タグ',
        description: '検索・閲覧頻度の高いトピック'
      }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container>
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className={styles.rankingsHeader}>
          <h1 className={styles.pageTitle}>ランキング・人気コンテンツ</h1>
          <p className={styles.pageDescription}>
            24時間・7日間で人気の金融ニュース、ブローカー、保険、記事、ツールをご覧ください。
            リアルタイムのアクセス数に基づいてランキングを更新しています。
          </p>
        </div>

        <Suspense fallback={<RankingsTabsSkeleton />}>
          <RankingsTabs 
            activeTab={activeTab}
            activeWindow={activeWindow}
          />
        </Suspense>
      </Container>
    </>
  );
}

// Skeleton loading component for stable CLS
function RankingsTabsSkeleton() {
  return (
    <div className={styles.rankingsSkeleton}>
      <div className={styles.tabsSkeleton}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.tabSkeleton} />
        ))}
      </div>
      
      <div className={styles.windowSelectorSkeleton}>
        <div className={styles.windowButtonSkeleton} />
        <div className={styles.windowButtonSkeleton} />
      </div>
      
      <div className={styles.contentSkeleton}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.rankingItemSkeleton}>
            <div className={styles.rankNumberSkeleton} />
            <div className={styles.contentDetailsSkeleton}>
              <div className={styles.titleSkeleton} />
              <div className={styles.metaSkeleton} />
            </div>
            <div className={styles.scoreSkeleton} />
          </div>
        ))}
      </div>
    </div>
  );
}