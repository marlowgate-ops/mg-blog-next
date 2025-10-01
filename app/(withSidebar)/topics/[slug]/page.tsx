import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedContent from '@/components/RelatedContent';
import { getTopicHub, getCuratedContent, getRelatedTopicHubs } from '@/lib/topics/hubs';
import styles from './page.module.css';

export const revalidate = 300;

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateStaticParams() {
  // Import topic hubs to generate static params
  const { getAllTopicHubs } = await import('@/lib/topics/hubs');
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

async function getTopicContent(topicId: string, page: number = 1) {
  try {
    // This would normally fetch from your content management system
    // For now, return mock data based on the topic
    const mockItems = [
      {
        id: `${topicId}-1`,
        title: `${topicId}に関する記事1`,
        excerpt: `${topicId}について詳しく解説した記事です。初心者にもわかりやすく説明しています。`,
        slug: `${topicId}-article-1`,
        href: `/blog/${topicId}-article-1`,
        updatedAt: new Date().toISOString(),
        topics: [topicId],
        featured: false
      },
      {
        id: `${topicId}-2`,
        title: `${topicId}の始め方ガイド`,
        excerpt: `${topicId}を始めるための基本的な手順とポイントを解説します。`,
        slug: `${topicId}-guide`,
        href: `/guides/${topicId}-guide`,
        updatedAt: new Date().toISOString(),
        topics: [topicId],
        featured: true
      }
    ];

    const itemsPerPage = 12;
    const offset = (page - 1) * itemsPerPage;
    
    return {
      items: mockItems.slice(offset, offset + itemsPerPage),
      totalPages: Math.ceil(mockItems.length / itemsPerPage),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching topic content:', error);
    return {
      items: [],
      totalPages: 0,
      currentPage: 1
    };
  }
}

export default async function TopicPage({ params, searchParams }: PageProps) {
  const hub = getTopicHub(params.slug);
  
  if (!hub) {
    notFound();
  }

  const page = parseInt(searchParams.page || '1', 10);
  const curatedContent = getCuratedContent(hub.id);
  const relatedHubs = getRelatedTopicHubs(hub.id);
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'トピック', href: '/topics' },
    { name: hub.title }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": hub.title,
    "description": hub.description,
    "url": `https://marlowgate.com/topics/${hub.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": Object.values(curatedContent).flat().length,
      "itemListElement": Object.values(curatedContent).flat().map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": item.title,
          "description": item.description,
          "url": `https://marlowgate.com${item.url}`,
          "keywords": [hub.title]
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
          <div className={styles.topicIcon}>{hub.icon}</div>
          <h1 className={styles.title}>{hub.title}</h1>
          <p className={styles.description}>{hub.description}</p>
        </div>

        {curatedContent.guides.length > 0 && (
          <RelatedContent
            title="関連ガイド"
            items={curatedContent.guides}
            type="guides"
            showViewAll={false}
          />
        )}

        {curatedContent.tools.length > 0 && (
          <RelatedContent
            title="関連ツール"
            items={curatedContent.tools}
            type="tools"
            showViewAll={false}
          />
        )}

        {curatedContent.brokers.length > 0 && (
          <RelatedContent
            title="関連ブローカー"
            items={curatedContent.brokers.map(broker => ({
              id: broker.id,
              title: broker.brand,
              description: broker.description,
              url: broker.url,
              score: broker.score,
              featured: broker.featured
            }))}
            type="brokers"
            showViewAll={false}
          />
        )}

        {curatedContent.insurance.length > 0 && (
          <RelatedContent
            title="関連保険"
            items={curatedContent.insurance.map(insurance => ({
              id: insurance.id,
              title: insurance.company,
              description: insurance.description,
              url: insurance.url,
              category: insurance.category,
              rating: insurance.rating,
              featured: insurance.featured
            }))}
            type="insurance"
            showViewAll={false}
          />
        )}

        {curatedContent.posts.length > 0 && (
          <RelatedContent
            title="関連記事"
            items={curatedContent.posts}
            type="posts"
            showViewAll={false}
          />
        )}

        {relatedHubs.length > 0 && (
          <RelatedContent
            title="関連トピック"
            items={relatedHubs.map(relatedHub => ({
              id: relatedHub.id,
              title: relatedHub.title,
              description: relatedHub.description,
              url: `/topics/${relatedHub.id}`
            }))}
            type="topics"
            showViewAll={false}
          />
        )}
      </Container>
    </>
  );
}