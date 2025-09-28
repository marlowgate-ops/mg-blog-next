import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import PrRibbon from '@/components/PrRibbon';

export const metadata: Metadata = {
  title: '医療保険比較 | おすすめ医療保険の保険料・給付内容を比較',
  description: '医療保険の保険料や給付内容を比較。入院給付金や手術給付金、先進医療特約など、最適な医療保険を見つけましょう。',
  openGraph: {
    title: '医療保険比較 | おすすめ医療保険の保険料・給付内容を比較',
    description: '医療保険の保険料や給付内容を比較。最適な医療保険を見つけましょう。',
    type: 'website',
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "医療保険比較",
  "description": "医療保険の保険料や給付内容を比較したリスト",
  "numberOfItems": 0,
  "itemListElement": []
};

export default function MedicalInsurancePage() {
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
            医療保険比較
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            margin: '0 0 24px 0' 
          }}>
            医療保険の保険料や給付内容を比較して、最適な保険を見つけましょう。
            入院給付金や手術給付金、先進医療特約など、重要なポイントを解説します。
          </p>
        </div>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: '0 0 24px 0' 
          }}>
            医療保険比較表
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
            医療保険選びのポイント
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
                入院給付金の設定
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                入院1日あたりの給付金額を適切に設定し、差額ベッド代なども考慮しましょう。
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
                先進医療特約
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                高額な先進医療費に備える特約の必要性を検討しましょう。
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
                通院・手術保障
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                通院治療や手術に対する保障内容も確認して選びましょう。
              </p>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}