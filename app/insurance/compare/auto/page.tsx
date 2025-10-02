import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PRRibbon';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '自動車保険比較 | 保険料・補償内容を徹底比較 | Marlow Gate',
  description: '自動車保険の保険料、対人・対物補償、ロードサービスなどを詳しく比較。あなたに最適な自動車保険を見つけましょう。',
  openGraph: {
    title: '自動車保険比較 | 保険料・補償内容を徹底比較',
    description: '自動車保険の保険料、対人・対物補償、ロードサービスなどを詳しく比較',
    type: 'website',
    url: 'https://marlowgate.com/insurance/compare/auto',
  },
  alternates: {
    canonical: 'https://marlowgate.com/insurance/compare/auto',
  },
};

export default function AutoInsuranceComparePage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "自動車保険比較",
    "description": "自動車保険の保険料、対人・対物補償、ロードサービスなどを詳しく比較",
    "url": "https://marlowgate.com/insurance/compare/auto"
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      <PrRibbon />
      
      <Container>
        <Breadcrumbs items={[
          { name: 'ホーム', href: '/' },
          { name: '保険', href: '/insurance' },
          { name: '自動車保険比較' }
        ]} />

        <div style={{ padding: '2rem 0' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>
            自動車保険比較
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            自動車保険の保険料、対人・対物補償、ロードサービスなどを詳しく比較して、あなたに最適な保険を見つけましょう。
          </p>
          
          <div style={{ 
            background: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>
              比較表を準備中
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              詳細な自動車保険比較表を近日公開予定です。
            </p>
            <Link 
              href="/best/insurance/auto" 
              style={{
                display: 'inline-block',
                background: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              既存の自動車保険ページを見る
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}