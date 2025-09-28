import type { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import SearchResults from './SearchResults';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '検索結果 | Marlow Gate',
  description: 'Marlow Gateサイト内検索の結果です。',
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    topics?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const selectedTopics = searchParams.topics ? searchParams.topics.split(',') : [];
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: '検索結果' }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `"${query}"の検索結果`,
    "url": `https://marlowgate.com/search?q=${encodeURIComponent(query)}`
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>
            {query ? `&quot;${query}&quot;の検索結果` : '検索'}
          </h1>
          {query && (
            <p className={styles.description}>
              キーワード&quot;{query}&quot;に関連するコンテンツを表示しています。
            </p>
          )}
        </div>

        <Suspense fallback={<div className={styles.loading}>検索中...</div>}>
          <SearchResults query={query} selectedTopics={selectedTopics} />
        </Suspense>
      </Container>
    </>
  );
}
