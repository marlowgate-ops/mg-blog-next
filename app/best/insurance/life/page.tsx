import type { Metadata } from 'next';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import PrRibbon from '@/components/PRRibbon';

export const metadata: Metadata = {
  title: '生命保険比較 | おすすめ生命保険の保険料・保障内容を比較',
  description: '生命保険の保険料や保障内容を比較。死亡保障や医療特約、収入保障など、家族を守る最適な生命保険を見つけましょう。',
  openGraph: {
    title: '生命保険比較 | おすすめ生命保険の保険料・保障内容を比較',
    description: '生命保険の保険料や保障内容を比較。家族を守る最適な生命保険を見つけましょう。',
    type: 'website',
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "生命保険比較",
  "description": "生命保険の保険料や保障内容を比較したリスト",
  "numberOfItems": 0,
  "itemListElement": []
};

export default function LifeInsurancePage() {
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
            生命保険比較
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            margin: '0 0 24px 0' 
          }}>
            生命保険の保険料や保障内容を比較して、家族を守る最適な保険を見つけましょう。
            死亡保障や医療特約、収入保障など、重要なポイントを解説します。
          </p>
        </div>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: '0 0 24px 0' 
          }}>
            生命保険比較表
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
            生命保険選びのポイント
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
                必要保障額の計算
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                家族構成や収入、支出を考慮して、必要な死亡保障額を算出しましょう。
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
                保険の種類と特徴
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                定期保険、終身保険、養老保険など、それぞれの特徴を理解して選びましょう。
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
                医療特約の検討
              </h3>
              <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                入院・手術給付金や先進医療特約など、医療保障も合わせて検討しましょう。
              </p>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}