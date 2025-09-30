import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import Link from 'next/link';
import { allInsuranceProducts } from 'contentlayer/generated';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '保険比較・選び方ガイド | 自動車・生命・医療保険を徹底比較 | Marlow Gate',
  description: '保険選びに迷っている方へ。自動車保険・生命保険・医療保険の比較から選び方まで、専門家監修のガイドで最適な保険を見つけられます。',
  openGraph: {
    title: '保険比較・選び方ガイド | 自動車・生命・医療保険を徹底比較',
    description: '保険選びに迷っている方へ。専門家監修のガイドで最適な保険を見つけられます。',
    type: 'website',
    url: 'https://marlowgate.com/insurance',
  },
  alternates: {
    canonical: 'https://marlowgate.com/insurance',
  },
};

const compareCategories = [
  {
    id: 'auto',
    title: '自動車保険',
    description: '対人・対物補償やロードサービスを比較',
    href: '/insurance/compare/auto',
    icon: '🚗',
    color: '#3b82f6'
  },
  {
    id: 'life',
    title: '生命保険',
    description: '死亡保障や医療特約を比較',
    href: '/insurance/compare/life',
    icon: '🛡️',
    color: '#10b981'
  },
  {
    id: 'medical',
    title: '医療保険',
    description: '入院・手術給付金を比較',
    href: '/insurance/compare/medical',
    icon: '🏥',
    color: '#f59e0b'
  }
];

const faqData = [
  {
    question: '保険選びで最も重要なポイントは何ですか？',
    answer: 'ライフスタイルや家族構成に合った補償内容を選ぶことが最重要です。保険料の安さだけでなく、必要な補償がしっかりカバーされているかを確認しましょう。'
  },
  {
    question: '保険料を安くする方法はありますか？',
    answer: 'インターネット契約割引や複数保険の同時契約割引、無事故割引などを活用できます。ただし、補償内容を削りすぎないよう注意が必要です。'
  },
  {
    question: '保険の見直しはどのくらいの頻度で行うべきですか？',
    answer: '基本的には年1回、または生活環境に大きな変化があった時（結婚、出産、転職など）に見直しを行うことをおすすめします。'
  },
  {
    question: '複数の保険会社に同時に加入することは可能ですか？',
    answer: '可能です。ただし、医療保険などでは給付金の重複受取りに制限がある場合があるため、契約前に各社の約款を確認することが重要です。'
  }
];

export default async function InsurancePage() {
  // Get insurance guides from content
  const guides = allInsuranceProducts.slice(0, 6).map(product => ({
    title: `${product.title}の選び方ガイド`,
    description: product.tagline,
    href: `/best/insurance/${product.category}/${product.slug}`,
    category: product.category,
    updatedAt: product.updatedAt
  }));

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "保険比較・選び方ガイド",
    "description": "自動車保険・生命保険・医療保険の比較から選び方まで、専門家監修のガイド",
    "url": "https://marlowgate.com/insurance"
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLd data={faqJsonLd} />
      <JsonLdBreadcrumbs />
      <PrRibbon />
      
      <Container>
        <Breadcrumbs items={[
          { name: 'ホーム', href: '/' },
          { name: '保険' }
        ]} />

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              あなたに最適な保険を見つけよう
            </h1>
            <p className={styles.heroDescription}>
              専門家監修の比較ガイドで、ライフスタイルに合った保険を簡単に選べます。
            </p>
            <Link href="#compare" className={styles.heroCta}>
              比較を始める
            </Link>
          </div>
        </section>

        {/* Compare Tiles Section */}
        <section id="compare" className={styles.compareSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>保険を比較する</h2>
            <p className={styles.sectionDescription}>
              カテゴリ別に保険を比較して、あなたにぴったりの保険を見つけましょう
            </p>
          </div>
          
          <div className={styles.compareGrid}>
            {compareCategories.map(category => (
              <Link
                key={category.id}
                href={category.href}
                className={styles.compareCard}
                style={{ '--card-color': category.color } as React.CSSProperties}
              >
                <div className={styles.compareCardIcon}>{category.icon}</div>
                <h3 className={styles.compareCardTitle}>{category.title}</h3>
                <p className={styles.compareCardDescription}>{category.description}</p>
                <span className={styles.compareCardAction}>比較表を見る →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Guides Section */}
        <section className={styles.guidesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>保険選びガイド</h2>
            <p className={styles.sectionDescription}>
              各保険の選び方や注意点を詳しく解説
            </p>
          </div>
          
          <div className={styles.guidesGrid}>
            {guides.map((guide, index) => (
              <Link key={index} href={guide.href} className={styles.guideCard}>
                <div className={styles.guideCategory}>
                  {guide.category === 'auto' ? '自動車保険' :
                   guide.category === 'life' ? '生命保険' : '医療保険'}
                </div>
                <h3 className={styles.guideTitle}>{guide.title}</h3>
                <p className={styles.guideDescription}>{guide.description}</p>
                <time className={styles.guideUpdated}>
                  {new Date(guide.updatedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>よくある質問</h2>
            <p className={styles.sectionDescription}>
              保険選びでよくお寄せいただく質問にお答えします
            </p>
          </div>
          
          <div className={styles.faqList}>
            {faqData.map((faq, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  {faq.question}
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}