import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import PrRibbon from '@/components/PrRibbon';

export const metadata: Metadata = {
  title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',
  description: '自動車保険の保険料や補償内容を比較。対人・対物・車両保険やロードサービスなど、あなたに最適な自動車保険を見つけましょう。',
  openGraph: {
    title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',
    description: '自動車保険の保険料や補償内容を比較。最適な自動車保険を見つけましょう。',
    type: 'website',
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "自動車保険比較",
  "description": "自動車保険の保険料や補償内容を比較したリスト",
  "numberOfItems": 0,
  "itemListElement": []
};

export default function CarInsurancePage() {
  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#111827', 
            margin: '0 0 16px 0' 
          }}>
            自動車保険比較
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            margin: '0 0 24px 0' 
          }}>
            自動車保険の保険料や補償内容を比較して、最適な保険を見つけましょう。
            対人・対物・車両保険やロードサービスなど、重要なポイントを解説します。
          </p>
        </div>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: '0 0 24px 0' 
          }}>
            自動車保険比較表
          </h2>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    商品名
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    保険種別
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    月額目安
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    申込導線
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    補足
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} style={{
                    padding: '48px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    比較データを準備中です
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: '0 0 24px 0' 
          }}>
            自動車保険選びのポイント
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ 
              background: '#f9fafb', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '20px' 
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: '0 0 12px 0' 
              }}>
                補償内容の確認
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                対人・対物・車両保険など、必要な補償が含まれているか確認しましょう。
              </p>
            </div>
            <div style={{ 
              background: '#f9fafb', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '20px' 
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: '0 0 12px 0' 
              }}>
                保険料の比較
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                年齢や車種、使用目的によって保険料が変わります。複数社で見積もりを取りましょう。
              </p>
            </div>
            <div style={{ 
              background: '#f9fafb', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '20px' 
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: '0 0 12px 0' 
              }}>
                事故対応・サービス
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                24時間365日の事故受付やロードサービス、代車サービスなどを確認しましょう。
              </p>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}