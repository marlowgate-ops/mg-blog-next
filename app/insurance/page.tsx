import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PRRibbon';
import { InsuranceHub } from '@/components/InsuranceHub';
import { ViewTracker } from '@/components/ViewTracker';
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

// Enhanced structured data for insurance comparison service
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '保険比較・選び方サービス',
  description: '自動車保険・生命保険・医療保険など各種保険の比較と選び方をサポートするサービス',
  provider: {
    '@type': 'Organization',
    name: 'Marlow Gate',
    url: 'https://marlowgate.com'
  },
  serviceType: '保険比較',
  areaServed: {
    '@type': 'Country',
    name: 'Japan'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '保険比較サービス',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '自動車保険比較',
          description: '対人・対物補償やロードサービスを比較'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '生命保険比較',
          description: '死亡保障や医療特約を比較'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '医療保険比較',
          description: '入院・手術給付金を比較'
        }
      }
    ]
  }
};

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
      <ViewTracker 
        title="保険比較・選び方ガイド"
        type="insurance"
        slug="insurance-hub"
      />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqJsonLd} />
      <JsonLdBreadcrumbs />
      <PrRibbon />
      
      <Container>
        <Breadcrumbs items={[
          { name: 'ホーム', href: '/' },
          { name: '保険' }
        ]} />

        <InsuranceHub />

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