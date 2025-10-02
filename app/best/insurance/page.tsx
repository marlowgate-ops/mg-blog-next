import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PRRibbon';
import Link from 'next/link';
import { allInsuranceProducts } from 'contentlayer/generated';
import InsuranceCard from '@/components/insurance/InsuranceCard';
import { itemListJSONLD } from '@/lib/seo/jsonld';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '保険比較 | おすすめ保険会社の比較・選び方ガイド | Marlow Gate',
  description: '自動車保険・生命保険・医療保険など各種保険の比較・選び方を解説。保険料や補償内容を比較して最適な保険を見つけましょう。',
  openGraph: {
    title: '保険比較 | おすすめ保険会社の比較・選び方ガイド',
    description: '自動車保険・生命保険・医療保険など各種保険の比較・選び方を解説。',
    type: 'website',
    url: 'https://marlowgate.com/best/insurance',
  },
  alternates: {
    canonical: 'https://marlowgate.com/best/insurance',
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
  { name: 'ホーム', href: '/' },
  { name: 'おすすめ比較', href: '/best' },
  { name: '保険比較' }
];

// Get popular insurance products (top rated from each category)
const getPopularInsuranceProducts = () => {
  const productsByCategory = {
    auto: allInsuranceProducts.filter(p => p.category === 'auto').sort((a, b) => b.ratingValue - a.ratingValue),
    medical: allInsuranceProducts.filter(p => p.category === 'medical').sort((a, b) => b.ratingValue - a.ratingValue),
    life: allInsuranceProducts.filter(p => p.category === 'life').sort((a, b) => b.ratingValue - a.ratingValue),
  };
  
  return [
    ...productsByCategory.auto.slice(0, 3),
    ...productsByCategory.medical.slice(0, 3), 
    ...productsByCategory.life.slice(0, 4)
  ].sort((a, b) => b.ratingValue - a.ratingValue);
};

const popularProducts = getPopularInsuranceProducts();

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "保険比較・選び方ガイド",
  "description": "自動車保険・生命保険・医療保険など各種保険の比較・選び方を解説",
  "url": "https://marlowgate.com/best/insurance",
  "mainEntity": itemListJSONLD("保険商品人気ランキング", popularProducts.slice(0, 10).map((product) => ({
    name: product.title,
    url: `https://marlowgate.com${product.url}`,
    ratingValue: product.ratingValue
  })))
};

export default function InsurancePage() {
  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        
        <Breadcrumbs items={breadcrumbs} />
        
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

        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>よくある質問</h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                保険はいつから入るべきですか？
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  保険は必要性を感じた時が加入のタイミングです。特に自動車保険は車を運転する前に必ず加入し、生命保険や医療保険は結婚や出産などのライフイベントを機に検討することをおすすめします。
                </p>
              </div>
            </details>
            
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                保険料を安くする方法はありますか？
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  保険料を抑える方法として、必要最低限の補償に絞る、免責額を高めに設定する、インターネット割引を活用する、複数社で見積もりを取って比較するなどがあります。ただし、補償を削りすぎると本来の目的を果たせなくなるため注意が必要です。
                </p>
              </div>
            </details>
            
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                保険の見直しはいつすればいいですか？
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  年1回の更新時や、結婚・出産・転職・家の購入などライフステージが変わったタイミングで見直しを行いましょう。また、新しい保険商品が出た際や保険料が家計を圧迫するようになった時も見直しの好機です。
                </p>
              </div>
            </details>
            
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                複数の保険会社で同じ保険に入ってもいいですか？
              </summary>
              <div className={styles.faqAnswer}>
                <p>
                  生命保険や医療保険など一部の保険では複数社での加入が可能ですが、自動車保険など重複加入に意味がない保険もあります。加入前に保険会社に確認し、必要に応じて既存の保険を見直すことをおすすめします。
                </p>
              </div>
            </details>
          </div>
        </section>

        <section className={styles.popular}>
          <h2 className={styles.popularTitle}>人気ランキング</h2>
          <p className={styles.popularDescription}>
            各カテゴリーから特に評価の高い保険商品をご紹介します。
          </p>
          <div className={styles.popularGrid}>
            {popularProducts.slice(0, 10).map((product, index) => (
              <div key={product.slug} className={styles.popularItem}>
                <div className={styles.popularRank}>#{index + 1}</div>
                <InsuranceCard
                  title={product.title}
                  provider={product.provider}
                  tagline={product.tagline}
                  pros={product.pros}
                  ratingValue={product.ratingValue}
                  ratingCount={product.ratingCount}
                  ctaLabel={product.ctaLabel}
                  ctaUrl={product.ctaUrl}
                  updatedAt={product.updatedAt}
                  url={product.url}
                />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}