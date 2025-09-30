import type { Metadata } from 'next';
import { Suspense } from 'react';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import BrokerCompareTable from '@/components/brokers/BrokerCompareTable';
import { allBrokers } from 'contentlayer/generated';
import s from './page.module.css';

interface SearchParams {
  brokers?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export const metadata: Metadata = {
  title: 'FXブローカー比較ツール | スプレッド・手数料・安全性を徹底比較',
  description: '主要FXブローカーのスプレッド、手数料、安全性、取引プラットフォームを一覧で比較。あなたに最適なFXブローカーを見つけましょう。',
  openGraph: {
    title: 'FXブローカー比較ツール | スプレッド・手数料・安全性を徹底比較',
    description: '主要FXブローカーのスプレッド、手数料、安全性、取引プラットフォームを一覧で比較。あなたに最適なFXブローカーを見つけましょう。',
    type: 'website',
    url: 'https://marlowgate.com/brokers/compare',
  },
  alternates: {
    canonical: 'https://marlowgate.com/brokers/compare',
  },
};

function ComparePageContent({ searchParams }: PageProps) {
  const selectedBrokerSlugs = searchParams.brokers?.split(',').filter(Boolean) || [];
  const selectedBrokers = allBrokers.filter(broker => 
    selectedBrokerSlugs.includes(broker.slug)
  );

  // If no brokers selected, show top 3 by rating
  const brokersToCompare = selectedBrokers.length > 0 
    ? selectedBrokers.slice(0, 3) // Max 3 brokers
    : allBrokers
        .sort((a, b) => b.ratingValue - a.ratingValue)
        .slice(0, 3);

  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'FXブローカー', href: '/brokers' },
    { name: 'ブローカー比較' }
  ];

  // JSON-LD structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "FXブローカー比較",
    "description": "主要FXブローカーの詳細比較",
    "url": "https://marlowgate.com/brokers/compare",
    "numberOfItems": brokersToCompare.length,
    "itemListElement": brokersToCompare.map((broker, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": broker.name,
        "url": `https://marlowgate.com${broker.url}`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": broker.ratingValue,
          "reviewCount": broker.ratingCount
        }
      }
    }))
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        <div className={s.header}>
          <h1 className={s.title}>FXブローカー比較ツール</h1>
          <p className={s.description}>
            主要FXブローカーのスプレッド、手数料、安全性、取引プラットフォームを詳細比較。
            {selectedBrokers.length > 0 ? '選択されたブローカー' : '評価の高いトップ3'}を比較しています。
          </p>
        </div>

        <BrokerSelector 
          allBrokers={allBrokers}
          selectedSlugs={selectedBrokerSlugs}
        />

        <div className={s.compareSection}>
          <h2 className={s.sectionTitle}>詳細比較</h2>
          <BrokerCompareTable brokers={brokersToCompare} />
        </div>

        <div className={s.tips}>
          <h3 className={s.tipsTitle}>ブローカー選びのポイント</h3>
          <div className={s.tipsGrid}>
            <div className={s.tip}>
              <h4 className={s.tipTitle}>💰 スプレッド</h4>
              <p className={s.tipText}>
                取引コストに直結する重要な要素。主要通貨ペアのスプレッドを比較しましょう。
              </p>
            </div>
            <div className={s.tip}>
              <h4 className={s.tipTitle}>🛡️ 安全性</h4>
              <p className={s.tipText}>
                規制機関による監督、信託保全、会社の財務健全性を確認しましょう。
              </p>
            </div>
            <div className={s.tip}>
              <h4 className={s.tipTitle}>📱 取引ツール</h4>
              <p className={s.tipText}>
                使いやすい取引プラットフォーム、豊富な分析ツール、スマホアプリの充実度。
              </p>
            </div>
            <div className={s.tip}>
              <h4 className={s.tipTitle}>🎯 サポート</h4>
              <p className={s.tipText}>
                24時間サポート、日本語対応、充実したマーケット情報の提供。
              </p>
            </div>
          </div>
        </div>

        <div className={s.disclaimer}>
          <h3 className={s.disclaimerTitle}>免責事項</h3>
          <p className={s.disclaimerText}>
            本比較は参考情報として提供されています。スプレッドや手数料は市場状況により変動する場合があります。
            最新の情報は各ブローカーの公式サイトでご確認ください。投資にはリスクが伴いますので、
            ご自身の判断と責任で取引を行ってください。
          </p>
        </div>
      </Container>
    </>
  );
}

function BrokerSelector({ allBrokers, selectedSlugs }: {
  allBrokers: any[];
  selectedSlugs: string[];
}) {
  return (
    <div className={s.selector}>
      <h2 className={s.selectorTitle}>比較するブローカーを選択（最大3社）</h2>
      <div className={s.brokerList}>
        {allBrokers.map((broker) => {
          const isSelected = selectedSlugs.includes(broker.slug);
          const newParams = new URLSearchParams();
          
          if (isSelected) {
            // Remove broker
            const filtered = selectedSlugs.filter(slug => slug !== broker.slug);
            if (filtered.length > 0) {
              newParams.set('brokers', filtered.join(','));
            }
          } else {
            // Add broker (max 3)
            const newSelection = [...selectedSlugs, broker.slug].slice(0, 3);
            newParams.set('brokers', newSelection.join(','));
          }

          const href = newParams.toString() ? `?${newParams.toString()}` : '?';

          return (
            <a
              key={broker.slug}
              href={href}
              className={`${s.brokerItem} ${isSelected ? s.selected : ''}`}
              onClick={(e) => {
                e.preventDefault();
                // GA4 event
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'broker_compare_add', {
                    broker_name: broker.name,
                    action: isSelected ? 'remove' : 'add'
                  });
                }
                window.location.href = href;
              }}
            >
              <div className={s.brokerInfo}>
                <h3 className={s.brokerName}>{broker.name}</h3>
                <div className={s.brokerMeta}>
                  <span className={s.rating}>★ {broker.ratingValue.toFixed(1)}</span>
                  <span className={s.safety}>安全性: {broker.safetyScore}/100</span>
                </div>
              </div>
              <div className={s.selectButton}>
                {isSelected ? '選択中' : '選択'}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePage(props: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComparePageContent {...props} />
    </Suspense>
  );
}