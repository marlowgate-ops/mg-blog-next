import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '医療保険比較 | 入院・手術給付金を徹底比較 | Marlow Gate',
  description: '医療保険の入院給付金、手術給付金、先進医療特約などを詳しく比較。あなたに必要な医療保険を見つけましょう。',
  openGraph: {
    title: '医療保険比較 | 入院・手術給付金を徹底比較',
    description: '医療保険の入院給付金、手術給付金、先進医療特約などを詳しく比較',
    type: 'website',
    url: 'https://marlowgate.com/insurance/compare/medical',
  },
  alternates: {
    canonical: 'https://marlowgate.com/insurance/compare/medical',
  },
};

export default function MedicalInsuranceComparePage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "医療保険比較",
    "description": "医療保険の入院給付金、手術給付金、先進医療特約などを詳しく比較",
    "url": "https://marlowgate.com/insurance/compare/medical"
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
          { name: '医療保険比較' }
        ]} />

        <div style={{ padding: '2rem 0' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>
            医療保険比較
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            医療保険の入院給付金、手術給付金、先進医療特約などを詳しく比較して、あなたに必要な保険を見つけましょう。
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
              詳細な医療保険比較表を近日公開予定です。
            </p>
            <Link 
              href="/best/insurance/medical" 
              style={{
                display: 'inline-block',
                background: '#f59e0b',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              既存の医療保険ページを見る
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}