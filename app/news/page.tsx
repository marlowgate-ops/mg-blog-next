import type { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@/components/Container';
import NewsContent from './NewsContent';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './page.module.css';

export const revalidate = 120;

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

export default function NewsPage() {
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
          <NewsContent />
        </Suspense>
      </Container>
    </>
  );
}