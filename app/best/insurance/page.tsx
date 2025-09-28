import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '保険比較 | おすすめ保険会社の比較・選び方ガイド',
  description: '自動車保険・生命保険・医療保険など各種保険の比較・選び方を解説。保険料や補償内容を比較して最適な保険を見つけましょう。',
  openGraph: {
    title: '保険比較 | おすすめ保険会社の比較・選び方ガイド',
    description: '自動車保険・生命保険・医療保険など各種保険の比較・選び方を解説。',
    type: 'website',
  },
};

const insuranceCategories = [
  {
    id: 'car',
    title: '自動車保険',
    description: '車の事故やトラブルに備える自動車保険の比較・選び方',
    href: '/best/insurance/car',
    icon: '🚗',
    features: ['対人・対物補償', '車両保険', 'ロードサービス', 'インターネット割引']
  },
  {
    id: 'life',
    title: '生命保険',
    description: 'もしもの時に家族を守る生命保険の比較・選び方',
    href: '/best/insurance/life',
    icon: '👨‍👩‍👧‍👦',
    features: ['死亡保障', '医療特約', '収入保障', '解約返戻金']
  },
  {
    id: 'medical',
    title: '医療保険',
    description: '入院・手術費用をカバーする医療保険の比較・選び方',
    href: '/best/insurance/medical',
    icon: '🏥',
    features: ['入院給付金', '手術給付金', '先進医療特約', '通院保障']
  }
];

const breadcrumbs = [
  { name: 'ホーム', item: '/' },
  { name: 'おすすめ比較', item: '/best' },
  { name: '保険比較', item: '/best/insurance' }
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "保険比較・選び方ガイド",
  "description": "自動車保険・生命保険・医療保険など各種保険の比較・選び方を解説",
  "url": "https://your-domain.com/best/insurance",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": insuranceCategories.length,
    "itemListElement": insuranceCategories.map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": category.title,
        "description": category.description,
        "url": `https://your-domain.com${category.href}`
      }
    }))
  }
};

export default function InsurancePage() {
  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        
        <div className={styles.header}>
          <h1 className={styles.title}>保険比較・選び方ガイド</h1>
          <p className={styles.description}>
            各種保険の比較・選び方を詳しく解説。保険料や補償内容を比較して、
            あなたに最適な保険を見つけましょう。
          </p>
        </div>

        <div className={styles.grid}>
          {insuranceCategories.map((category) => (
            <Link key={category.id} href={category.href} className={styles.card}>
              <div className={styles.cardIcon}>{category.icon}</div>
              <h2 className={styles.cardTitle}>{category.title}</h2>
              <p className={styles.cardDescription}>{category.description}</p>
              <ul className={styles.features}>
                {category.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className={styles.cardAction}>
                詳細を見る →
              </div>
            </Link>
          ))}
        </div>

        <section className={styles.guides}>
          <h2 className={styles.guidesTitle}>保険選びの基礎知識</h2>
          <div className={styles.guideGrid}>
            <div className={styles.guideCard}>
              <h3 className={styles.guideTitle}>保険の基本</h3>
              <p className={styles.guideText}>
                保険の仕組みや種類、選び方の基本を解説します。
              </p>
            </div>
            <div className={styles.guideCard}>
              <h3 className={styles.guideTitle}>保険料の決まり方</h3>
              <p className={styles.guideText}>
                保険料がどのように計算されるか、節約のコツを紹介します。
              </p>
            </div>
            <div className={styles.guideCard}>
              <h3 className={styles.guideTitle}>保険金請求の流れ</h3>
              <p className={styles.guideText}>
                もしもの時の手続き方法や注意点を説明します。
              </p>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}