import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import ListGrid from '@/components/ListGrid';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import topicsData from '@/config/topics.json';
import styles from './page.module.css';

export const revalidate = 300;

interface Topic {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const topics = topicsData as Topic[];
  const topic = topics.find(t => t.id === params.slug);
  
  if (!topic) {
    return {
      title: 'トピックが見つかりません',
      description: '指定されたトピックは存在しません。'
    };
  }

  return {
    title: `${topic.label} | トピック | Marlow Gate`,
    description: topic.description,
    openGraph: {
      title: `${topic.label} | トピック`,
      description: topic.description,
      type: 'website',
      url: `https://marlowgate.com/topics/${topic.id}`,
    },
    alternates: {
      canonical: `https://marlowgate.com/topics/${topic.id}`,
    },
  };
}

export default async function TopicPage({ params, searchParams }: PageProps) {
  const topics = topicsData as Topic[];
  const topic = topics.find(t => t.id === params.slug);
  
  if (!topic) {
    notFound();
  }

  const page = parseInt(searchParams.page || '1', 10);
  const { items, totalPages, currentPage } = await getTopicContent(topic.id, page);
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'トピック', href: '/topics' },
    { name: topic.label }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": topic.label,
    "description": topic.description,
    "url": `https://marlowgate.com/topics/${topic.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": item.title,
          "description": item.excerpt,
          "url": `https://marlowgate.com${item.href}`,
          "keywords": [topic.label]
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
          <div className={styles.topicIcon}>{topic.icon}</div>
          <h1 className={styles.title}>{topic.label}</h1>
          <p className={styles.description}>{topic.description}</p>
        </div>

        <ListGrid items={items} />
        
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {currentPage > 1 && (
              <a 
                href={`/topics/${topic.id}?page=${currentPage - 1}`}
                className={styles.paginationLink}
              >
                ← 前のページ
              </a>
            )}
            
            <span className={styles.pageInfo}>
              {currentPage} / {totalPages}
            </span>
            
            {currentPage < totalPages && (
              <a 
                href={`/topics/${topic.id}?page=${currentPage + 1}`}
                className={styles.paginationLink}
              >
                次のページ →
              </a>
            )}
          </div>
        )}
      </Container>
    </>
  );
}