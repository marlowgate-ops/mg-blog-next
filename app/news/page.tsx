import type { Metadata } from 'next';
import Container from '@/components/Container';
import NewsClientWrapper from './NewsClientWrapper';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const metadata: Metadata = {
  title: '最新マーケットニュース | FX・投資情報 | Marlow Gate',
  description: '最新の金融市場ニュースや投資情報をリアルタイムでお届け。FX、株式、暗号資産など幅広い投資ニュースを提供。',
  openGraph: {
    title: '最新マーケットニュース | FX・投資情報',
    description: '最新の金融市場ニュースや投資情報をリアルタイムでお届け。',
    type: 'website',
    url: 'https://marlowgate.com/news',
  },
  alternates: {
    canonical: 'https://marlowgate.com/news',
  },
};

async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 300 } // 5 minutes
    });
    
    if (!response.ok) {
      console.error('Failed to fetch news:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsPage() {
  const newsItems = await getNewsItems();
  const uniqueSources = Array.from(new Set(newsItems.map(item => item.source)));
  
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "最新マーケットニュース",
    "description": "金融・投資関連の最新ニュース一覧",
    "url": "https://marlowgate.com/news",
    "numberOfItems": newsItems.length,
    "itemListElement": newsItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": item.title,
        "url": item.url,
        "publisher": {
          "@type": "Organization",
          "name": item.source
        },
        "datePublished": item.publishedAt
      }
    }))
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      <Container>
        <Breadcrumbs items={[
          { name: 'ホーム', href: '/' },
          { name: 'ニュース' }
        ]} />
        
        <div className={styles.header}>
          <h1 className={styles.title}>最新マーケットニュース</h1>
          <p className={styles.description}>
            金融市場の最新情報をリアルタイムでお届け
          </p>
        </div>

        <NewsClientWrapper 
          initialItems={newsItems} 
          sources={uniqueSources}
        />
      </Container>
    </>
  );
}