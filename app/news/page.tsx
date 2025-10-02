import type { Metadata } from 'next';
import { Suspense } from 'react';
import { z } from 'zod';
import Container from '@/components/Container';
import NewsContent from './NewsContent';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './page.module.css';

export const revalidate = 120;

// News URL state schema (matching NewsContent)
const newsUrlSchema = z.object({
  q: z.string().optional().default(''),
  providers: z.array(z.string()).optional().default([]),
  period: z.enum(['day', 'week']).optional().default('week'),
  offset: z.number().optional().default(0),
});

type NewsUrlState = z.infer<typeof newsUrlSchema>;

interface NewsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function parseNewsSearchParams(searchParams: Record<string, string | string[] | undefined>): NewsUrlState {
  try {
    // Convert searchParams to URLSearchParams for consistent handling
    const urlSearchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) {
            urlSearchParams.append(key, v);
          }
        } else {
          urlSearchParams.set(key, value);
        }
      }
    }
    
    // Parse with proper types
    const q = urlSearchParams.get('q') || '';
    const providersParam = urlSearchParams.get('providers');
    const providers = providersParam ? providersParam.split(',').filter(Boolean) : [];
    const period = urlSearchParams.get('period') === 'day' ? 'day' : 'week';
    const offset = Math.max(0, parseInt(urlSearchParams.get('offset') || '0', 10));
    
    return newsUrlSchema.parse({ q, providers, period, offset });
  } catch {
    // Return defaults if parsing fails
    return newsUrlSchema.parse({});
  }
}

export const metadata: Metadata = {
  title: '最新マーケットニュース | FX・投資情報 | Marlow Gate',
  description: '最新の金融市場ニュースや投資情報をリアルタイムでお届け。FX、株式、暗号資産など幅広い投資ニュースを提供。',
  openGraph: {
    title: '最新マーケットニュース | FX・投資情報',
    description: '最新の金融市場ニュースや投資情報をリアルタイムでお届け。',
    type: 'website',
    url: 'https://marlowgate.com/news',
    images: [
      {
        url: '/api/og?type=news&title=最新マーケットニュース&subtitle=FX・投資・暗号資産の最新情報をリアルタイムでお届け&source=Marlow Gate',
        width: 1200,
        height: 630,
        alt: '最新マーケットニュース | Marlow Gate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '最新マーケットニュース | FX・投資情報',
    description: '最新の金融市場ニュースや投資情報をリアルタイムでお届け。',
    images: ['/api/og?type=news&title=最新マーケットニュース&subtitle=FX・投資・暗号資産の最新情報をリアルタイムでお届け&source=Marlow Gate'],
  },
  alternates: {
    canonical: 'https://marlowgate.com/news',
  },
};

export default function NewsPage({ searchParams }: NewsPageProps = { searchParams: {} }) {
  // Parse URL params on server for SSR initialization
  const initialState = parseNewsSearchParams(searchParams);
  
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "最新マーケットニュース",
    "description": "金融・投資関連の最新ニュース一覧",
    "url": "https://marlowgate.com/news"
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
            信頼できる情報源から、金融市場の最新情報をリアルタイムでお届け
          </p>
        </div>

        <Suspense fallback={<div className={styles.loading}>読み込み中...</div>}>
          <NewsContent initialState={initialState} />
        </Suspense>
      </Container>
    </>
  );
}