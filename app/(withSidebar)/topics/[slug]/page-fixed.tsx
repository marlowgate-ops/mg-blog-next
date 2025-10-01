import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedContent from '@/components/RelatedContent';
import { getTopicHub, getCuratedContent, getRelatedTopicHubs, getAllTopicHubs } from '@/lib/topics/hubs';
import styles from './page.module.css';

export const revalidate = 300;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const hubs = getAllTopicHubs();
  
  return hubs.map((hub) => ({
    slug: hub.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const hub = getTopicHub(params.slug);

  if (!hub) {
    return {
      title: 'トピックが見つかりません | Marlow Gate',
    };
  }

  return {
    title: `${hub.title} | Marlow Gate`,
    description: hub.description,
    keywords: hub.keywords.join(', '),
    openGraph: {
      title: `${hub.title} | Marlow Gate`,
      description: hub.description,
      type: 'website',
      url: `https://marlowgate.com/topics/${hub.id}`,
    },
    alternates: {
      canonical: `https://marlowgate.com/topics/${hub.id}`,
    },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const hub = getTopicHub(params.slug);
  
  if (!hub) {
    notFound();
  }

  const curatedContent = await getCuratedContent(hub.id);
  const relatedHubs = getRelatedTopicHubs(hub.id);
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'トピック', href: '/topics' },
    { name: hub.title, href: `/topics/${hub.id}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    description: hub.description,
    url: `https://marlowgate.com/topics/${hub.id}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: Object.values(curatedContent).reduce((acc, section) => acc + section.length, 0),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        
        <div className={styles.hubHeader}>
          <div className={styles.hubIcon}>{hub.icon}</div>
          <h1 className={styles.title}>{hub.title}</h1>
          <p className={styles.description}>{hub.description}</p>
          <div className={styles.keywords}>
            {hub.keywords.map((keyword) => (
              <span key={keyword} className={styles.keyword}>
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {curatedContent.guides.length > 0 && (
          <RelatedContent
            type="guides"
            items={curatedContent.guides}
            title="関連ガイド"
          />
        )}

        {curatedContent.tools.length > 0 && (
          <RelatedContent
            type="tools"
            items={curatedContent.tools}
            title="関連ツール"
          />
        )}

        {curatedContent.brokers.length > 0 && (
          <RelatedContent
            type="brokers"
            items={curatedContent.brokers.map(broker => ({
              id: broker.id,
              title: broker.brand,
              description: broker.description,
              url: broker.url,
              featured: broker.featured,
              score: broker.score
            }))}
            title="関連ブローカー"
          />
        )}

        {curatedContent.insurance.length > 0 && (
          <RelatedContent
            type="insurance"
            items={curatedContent.insurance.map(insurance => ({
              id: insurance.id,
              title: insurance.company,
              description: insurance.description,
              url: insurance.url,
              featured: insurance.featured,
              rating: insurance.rating,
              category: insurance.category
            }))}
            title="関連保険"
          />
        )}

        {curatedContent.posts.length > 0 && (
          <RelatedContent
            type="posts"
            items={curatedContent.posts}
            title="関連記事"
          />
        )}

        {relatedHubs.length > 0 && (
          <RelatedContent
            type="topics"
            items={relatedHubs.map(hub => ({
              id: hub.id,
              title: hub.title,
              description: hub.description,
              url: `/topics/${hub.id}`,
              featured: hub.featured
            }))}
            title="関連トピック"
          />
        )}
      </Container>
    </>
  );
}