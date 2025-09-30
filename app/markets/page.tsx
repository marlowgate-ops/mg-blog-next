import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import MarketTicker from '@/components/MarketTicker';
import { getMarketData } from '@/lib/market-data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'リアルタイム市況・相場情報 | 為替・株価指数 | Marlow Gate',
  description: 'USD/JPY、EUR/JPY、日経平均株価、TOPIX、S&P500などの最新相場情報をリアルタイムで提供。投資判断にお役立てください。',
  openGraph: {
    title: 'リアルタイム市況・相場情報 | 為替・株価指数',
    description: 'USD/JPY、EUR/JPY、日経平均株価、TOPIX、S&P500などの最新相場情報をリアルタイムで提供',
    type: 'website',
    url: 'https://marlowgate.com/markets',
  },
  alternates: {
    canonical: 'https://marlowgate.com/markets',
  },
};

// Cache for 2 minutes
export const revalidate = 120;

export default async function MarketsPage() {
  // Pre-fetch market data for initial render
  let initialData = null;
  try {
    initialData = await getMarketData();
  } catch (error) {
    // Fallback data will be used by the component
    console.warn('Failed to pre-fetch market data:', error);
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "リアルタイム市況・相場情報",
    "description": "USD/JPY、EUR/JPY、日経平均株価、TOPIX、S&P500などの最新相場情報をリアルタイムで提供",
    "url": "https://marlowgate.com/markets"
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      <PrRibbon />
      
      <Container>
        <Breadcrumbs items={[
          { name: 'ホーム', href: '/' },
          { name: '市況情報' }
        ]} />

        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>リアルタイム市況・相場情報</h1>
            <p className={styles.description}>
              主要通貨ペアおよび株価指数の最新相場情報をリアルタイムで提供します。
              投資判断の参考にご活用ください。
            </p>
          </header>

          <section className={styles.marketSection}>
            <MarketTicker initialData={initialData} limit={10} showTitle={false} />
          </section>

          <section className={styles.explainerSection}>
            <h2 className={styles.sectionTitle}>市況データについて</h2>
            <div className={styles.explainerGrid}>
              <div className={styles.explainerCard}>
                <h3 className={styles.cardTitle}>為替相場</h3>
                <p className={styles.cardDescription}>
                  USD/JPY（米ドル円）、EUR/JPY（ユーロ円）など主要通貨ペアのリアルタイムレートを表示。
                  前日比の変動率も併せて確認できます。
                </p>
              </div>
              <div className={styles.explainerCard}>
                <h3 className={styles.cardTitle}>株価指数</h3>
                <p className={styles.cardDescription}>
                  日経平均株価、TOPIX、S&P 500など代表的な株価指数の現在値と変動率を表示。
                  市場の全体的な動向を把握できます。
                </p>
              </div>
              <div className={styles.explainerCard}>
                <h3 className={styles.cardTitle}>更新頻度</h3>
                <p className={styles.cardDescription}>
                  データは2分間隔で自動更新されます。最新の市況状況を常に確認いただけます。
                  ネットワークエラー時は安全なフォールバックデータを表示します。
                </p>
              </div>
            </div>
          </section>

          <section className={styles.disclaimerSection}>
            <h3 className={styles.disclaimerTitle}>免責事項</h3>
            <p className={styles.disclaimerText}>
              表示される相場情報は参考情報であり、投資助言や取引の推奨を目的としたものではありません。
              投資判断は必ずご自身の責任で行ってください。当サイトは情報の正確性を保証するものではなく、
              投資結果について一切の責任を負いません。
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}