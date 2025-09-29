import type { Metadata } from 'next';import type { Metadata } from 'next';import type { Metadata } from 'next';

import Container from '@/components/Container';

import JsonLd from '@/components/JsonLd';import Container from '@/components/Container';import Container from '@/components/Container';

import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';

import PrRibbon from '@/components/PrRibbon';import JsonLd from '@/components/JsonLd';import JsonLd from '@/components/JsonLd';



export const metadata: Metadata = {import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';

  title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',

  description: '自動車保険の保険料や補償内容を比較。対人・対物・車両保険やロードサービスなど、あなたに最適な自動車保険を見つけましょう。',import Breadcrumbs from '@/components/Breadcrumbs';import Breadcrumbs from '@/components/Breadcrumbs';

  openGraph: {

    title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',import PrRibbon from '@/components/PrRibbon';import PrRibbon from '@/components/PrRibbon';

    description: '自動車保険の保険料や補償内容を比較。最適な自動車保険を見つけましょう。',

    type: 'website',import { allInsuranceProducts } from 'contentlayer/generated';import { allInsuranceProducts } from 'contentlayer/generated';

  },

};import CategoryHero from '@/components/insurance/CategoryHero';import CategoryHero from '@/components/insurance/CategoryHero';



const jsonLdData = {import InsuranceCard from '@/components/insurance/InsuranceCard';import InsuranceCard from '@/components/insurance/InsuranceCard';

  "@context": "https://schema.org",

  "@type": "ItemList",import CompareTable from '@/components/insurance/CompareTable';import CompareTable from '@/components/insurance/CompareTable';

  "name": "自動車保険比較",

  "description": "自動車保険の保険料や補償内容を比較したリスト",import FAQ from '@/components/Faq';import FAQ from '@/components/Faq';

  "numberOfItems": 0,

  "itemListElement": []import { itemListJSONLD, breadcrumbList, faqPage } from '@/lib/seo/jsonld';import { itemListJSONLD, breadcrumbList, faqPage } from '@/lib/seo/jsonld';

};



export default function CarInsurancePage() {

  return (export const metadata: Metadata = {export const metadata: Metadata = {

    <>

      <JsonLd data={jsonLdData} />  title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',  title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',

      <JsonLdBreadcrumbs />

        description: '自動車保険の保険料や補償内容を比較。対人・対物・車両保険やロードサービスなど、あなたに最適な自動車保険を見つけましょう。',  description: '自動車保険の保険料や補償内容を比較。対人・対物・車両保険やロードサービスなど、あなたに最適な自動車保険を見つけましょう。',

      <Container>

        <PrRibbon />  openGraph: {  openGraph: {

        

        <div style={{ marginBottom: '32px' }}>    title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',    title: '自動車保険比較 | おすすめ自動車保険の保険料・補償内容を比較',

          <h1 style={{ 

            fontSize: '32px',     description: '自動車保険の保険料や補償内容を比較。最適な自動車保険を見つけましょう。',    description: '自動車保険の保険料や補償内容を比較。最適な自動車保険を見つけましょう。',

            fontWeight: '700', 

            color: '#111827',     type: 'website',    type: 'website',

            margin: '0 0 16px 0' 

          }}>    url: 'https://marlowgate.com/best/insurance/car',    url: 'https://marlowgate.com/best/insurance/car',

            自動車保険比較

          </h1>  },  },

          <p style={{ 

            fontSize: '18px',   alternates: {  alternates: {

            color: '#6b7280', 

            margin: '0 0 24px 0'     canonical: 'https://marlowgate.com/best/insurance/car',    canonical: 'https://marlowgate.com/best/insurance/car',

          }}>

            自動車保険の保険料や補償内容を比較して、最適な保険を見つけましょう。  },  },

            対人・対物・車両保険やロードサービスなど、重要なポイントを解説します。

          </p>};};

        </div>

      </Container>

    </>

  );const autoInsuranceProducts = allInsuranceProductsconst autoInsuranceProducts = allInsuranceProducts

}
  .filter(product => product.category === 'auto')  .filter(product => product.category === 'auto')

  .sort((a, b) => b.ratingValue - a.ratingValue);  .sort((a, b) => b.ratingValue - a.ratingValue);



const breadcrumbs = [const breadcrumbs = [

  { name: 'ホーム', href: '/' },  { name: 'ホーム', href: '/' },

  { name: 'おすすめ比較', href: '/best' },  { name: 'おすすめ比較', href: '/best' },

  { name: '保険比較', href: '/best/insurance' },  { name: '保険比較', href: '/best/insurance' },

  { name: '自動車保険比較' }  { name: '自動車保険比較' }

];];



const faqData = [const faqData = [

  {  {

    q: "自動車保険の補償内容で重要なものは何ですか？",    q: "自動車保険の補償内容で重要なものは何ですか？",

    a: "対人・対物賠償責任保険は必須で、できれば無制限にしましょう。車両保険、人身傷害補償保険、ロードサービスも重要な補償です。"    a: "対人・対物賠償責任保険は必須で、できれば無制限にしましょう。車両保険、人身傷害補償保険、ロードサービスも重要な補償です。"

  },  },

  {  {

    q: "保険料を安くするにはどうすればいいですか？",    q: "保険料を安くするにはどうすればいいですか？",

    a: "年齢条件や運転者限定特約の設定、車両保険の免責金額設定、インターネット割引の活用などが効果的です。"    a: "年齢条件や運転者限定特約の設定、車両保険の免責金額設定、インターネット割引の活用などが効果的です。"

  },  },

  {  {

    q: "事故を起こした時の対応は？",    q: "事故を起こした時の対応は？",

    a: "まず安全確保と警察への連絡、その後保険会社への事故報告を速やかに行います。24時間対応の事故受付サービスを利用しましょう。"    a: "まず安全確保と警察への連絡、その後保険会社への事故報告を速やかに行います。24時間対応の事故受付サービスを利用しましょう。"

  }  }

];];



const jsonLdData = {const jsonLdData = {

  "@context": "https://schema.org",  "@context": "https://schema.org",

  "@type": "CollectionPage",  "@type": "CollectionPage",

  "name": "自動車保険比較",  "name": "自動車保険比較",

  "description": "自動車保険の保険料や補償内容を比較したリスト",  "description": "自動車保険の保険料や補償内容を比較したリスト",

  "url": "https://marlowgate.com/best/insurance/car",  "url": "https://marlowgate.com/best/insurance/car",

  "breadcrumb": breadcrumbList(breadcrumbs.map(b => ({ name: b.name, item: b.href || '' }))),  "breadcrumb": breadcrumbList(breadcrumbs.map(b => ({ name: b.name, item: b.href || '' }))),

  "mainEntity": itemListJSONLD("自動車保険ランキング", autoInsuranceProducts.map(product => ({  "mainEntity": itemListJSONLD("自動車保険ランキング", autoInsuranceProducts.map(product => ({

    name: product.title,    name: product.title,

    url: `https://marlowgate.com${product.url}`,    url: `https://marlowgate.com${product.url}`,

    ratingValue: product.ratingValue    ratingValue: product.ratingValue

  }))),  }))),

  "faq": faqPage(faqData)  "faq": faqPage(faqData)

};};



export default function CarInsurancePage() {export default function CarInsurancePage() {

  return (  return (

    <>    <>

      <JsonLd data={jsonLdData} />      <JsonLd data={jsonLdData} />

      <JsonLdBreadcrumbs />      <JsonLdBreadcrumbs />

            

      <Container>      <Container>

        <PrRibbon />        <PrRibbon />

        <Breadcrumbs items={breadcrumbs} />        <Breadcrumbs items={breadcrumbs} />

                

        <CategoryHero        <CategoryHero

          title="自動車保険比較"          title="自動車保険比較"

          description="自動車保険の保険料や補償内容を比較して、最適な保険を見つけましょう。対人・対物・車両保険やロードサービスなど、重要なポイントを解説します。"          description="自動車保険の保険料や補償内容を比較して、最適な保険を見つけましょう。対人・対物・車両保険やロードサービスなど、重要なポイントを解説します。"

          tags={['対人・対物補償', '車両保険', 'ロードサービス', 'インターネット割引']}          tags={['対人・対物補償', '車両保険', 'ロードサービス', 'インターネット割引']}

          icon="🚗"          icon="🚗"

        />        />



        <section style={{ marginBottom: '48px' }}>        <section style={{ marginBottom: '48px' }}>

          <h2 style={{           <h2 style={{ 

            fontSize: '24px',             fontSize: '24px', 

            fontWeight: '700',             fontWeight: '700', 

            marginBottom: '24px',            marginBottom: '24px',

            color: '#111827'            color: '#111827'

          }}>          }}>

            自動車保険ランキング            自動車保険ランキング

          </h2>          </h2>

          <div style={{           <div style={{ 

            display: 'grid',             display: 'grid', 

            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',             gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 

            gap: '24px'             gap: '24px' 

          }}>          }}>

            {autoInsuranceProducts.map((product) => (            {autoInsuranceProducts.map((product) => (

              <InsuranceCard              <InsuranceCard

                key={product.slug}                key={product.slug}

                title={product.title}                title={product.title}

                provider={product.provider}                provider={product.provider}

                tagline={product.tagline}                tagline={product.tagline}

                pros={product.pros}                pros={product.pros}

                ratingValue={product.ratingValue}                ratingValue={product.ratingValue}

                ratingCount={product.ratingCount}                ratingCount={product.ratingCount}

                ctaLabel={product.ctaLabel}                ctaLabel={product.ctaLabel}

                ctaUrl={product.ctaUrl}                ctaUrl={product.ctaUrl}

                updatedAt={product.updatedAt}                updatedAt={product.updatedAt}

                url={product.url}                url={product.url}

              />              />

            ))}            ))}

          </div>          </div>

        </section>        </section>



        <section style={{ marginBottom: '48px' }}>        <section style={{ marginBottom: '48px' }}>

          <h2 style={{           <h2 style={{ 

            fontSize: '24px',             fontSize: '24px', 

            fontWeight: '700',             fontWeight: '700', 

            marginBottom: '24px',            marginBottom: '24px',

            color: '#111827'            color: '#111827'

          }}>          }}>

            自動車保険比較表            自動車保険比較表

          </h2>          </h2>

          <CompareTable items={autoInsuranceProducts} />          <CompareTable items={autoInsuranceProducts} />

        </section>        </section>



        <FAQ items={faqData} />        <FAQ data={faqData} />



        <section style={{         <section style={{ 

          background: '#f9fafb',           background: '#f9fafb', 

          padding: '32px',           padding: '32px', 

          borderRadius: '8px',          borderRadius: '8px',

          border: '1px solid #e5e7eb',          border: '1px solid #e5e7eb',

          marginTop: '48px'          marginTop: '48px'

        }}>        }}>

          <h3 style={{           <h3 style={{ 

            fontSize: '18px',             fontSize: '18px', 

            fontWeight: '600',             fontWeight: '600', 

            marginBottom: '16px',            marginBottom: '16px',

            color: '#111827'            color: '#111827'

          }}>          }}>

            免責事項            免責事項

          </h3>          </h3>

          <p style={{           <p style={{ 

            color: '#6b7280',             color: '#6b7280', 

            fontSize: '14px',             fontSize: '14px', 

            lineHeight: '1.6',            lineHeight: '1.6',

            margin: 0            margin: 0

          }}>          }}>

            本サイトの情報は一般的な情報提供を目的としており、個別の保険商品の詳細や最新の保険料については、            本サイトの情報は一般的な情報提供を目的としており、個別の保険商品の詳細や最新の保険料については、

            各保険会社の公式サイトや代理店にて必ずご確認ください。保険選びは個人の状況により最適解が異なりますので、            各保険会社の公式サイトや代理店にて必ずご確認ください。保険選びは個人の状況により最適解が異なりますので、

            専門家へのご相談をおすすめします。            専門家へのご相談をおすすめします。

          </p>          </p>

        </section>        </section>

      </Container>      </Container>

    </>    </>

  );  );

}}
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