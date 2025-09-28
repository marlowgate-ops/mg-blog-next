import { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import Breadcrumbs from '@/components/Breadcrumbs';
import ListGrid from '@/components/ListGrid';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'レビュー・評価 | 金融サービス・投資商品の詳細レビュー',
  description: '実際の利用体験に基づいた金融サービス・投資商品の詳細レビューと評価をお届けします。',
  alternates: {
    canonical: '/reviews',
  },
};

const breadcrumbItems = [
  { name: 'ホーム', href: '/' },
  { name: 'レビュー', href: '/reviews' },
];

export default function ReviewsPage() {
  // Filter posts that are reviews
  const reviewPosts = allPosts
    .filter(post => 
      post.tags?.some(tag => 
        ['review', 'comparison', 'evaluation', 'rating'].includes(tag.toLowerCase())
      ) || 
      post.title.toLowerCase().includes('レビュー') ||
      post.title.toLowerCase().includes('評価') ||
      post.title.toLowerCase().includes('比較') ||
      post.url.includes('/reviews/')
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Transform posts to ListItem format
  const listItems = reviewPosts.map(post => ({
    id: post._id,
    href: post.url,
    title: post.title,
    excerpt: post.description,
    slug: post.slug || post._id,
    updatedAt: post.date,
    topics: post.tags,
    featured: false,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'レビュー・評価',
    description: '実際の利用体験に基づいた金融サービス・投資商品の詳細レビューと評価をお届けします。',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/reviews`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: reviewPosts.length,
      itemListElement: reviewPosts.slice(0, 10).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}${post.url}`,
        name: post.title,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: index === breadcrumbItems.length - 1 ? undefined : `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            margin: '0 0 0.5rem 0',
            color: 'var(--color-text-primary)'
          }}>
            レビュー・評価
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            margin: 0 
          }}>
            実際の利用体験に基づいた金融サービス・投資商品の詳細レビューと評価をお届けします。
            客観的な視点から各サービスの特徴、メリット・デメリットを詳しく解説しています。
          </p>
        </div>

        <ListGrid 
          items={listItems}
          showTopics={true}
          showDate={true}
        />
      </div>
    </>
  );
}