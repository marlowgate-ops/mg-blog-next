import { Metadata } from 'next';
import { allPosts } from 'contentlayer/generated';
import Breadcrumbs from '@/components/Breadcrumbs';
import ListGrid from '@/components/ListGrid';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'ガイド・入門記事 | 金融・投資の基礎知識',
  description: '初心者向けから上級者向けまで、金融・投資に関する包括的なガイドと入門記事をお届けします。',
  alternates: {
    canonical: '/guides',
  },
};

const breadcrumbItems = [
  { name: 'ホーム', href: '/' },
  { name: 'ガイド', href: '/guides' },
];

export default function GuidesPage() {
  // Filter posts that are guides (you can adjust this logic based on your content structure)
  const guidePosts = allPosts
    .filter(post => 
      post.tags?.some(tag => 
        ['guide', 'beginner', 'tutorial', 'how-to', 'basics'].includes(tag.toLowerCase())
      ) || 
      post.title.toLowerCase().includes('ガイド') ||
      post.title.toLowerCase().includes('入門') ||
      post.title.toLowerCase().includes('初心者')
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Transform posts to ListItem format
  const listItems = guidePosts.map(post => ({
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
    name: 'ガイド・入門記事',
    description: '初心者向けから上級者向けまで、金融・投資に関する包括的なガイドと入門記事をお届けします。',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/guides`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guidePosts.length,
      itemListElement: guidePosts.slice(0, 10).map((post, index) => ({
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
            ガイド・入門記事
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: '1.125rem',
            lineHeight: '1.6',
            margin: 0 
          }}>
            初心者向けから上級者向けまで、金融・投資に関する包括的なガイドと入門記事をお届けします。
            基礎知識から実践的なテクニックまで、段階的に学習できるコンテンツを豊富に用意しています。
          </p>
        </div>

        <ListGrid 
          items={listItems}
          showTopics={true}
        />
      </div>
    </>
  );
}