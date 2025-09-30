import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import { allInsuranceProducts } from 'contentlayer/generated';
import CategoryHero from '@/components/insurance/CategoryHero';
import InsuranceCard from '@/components/insurance/InsuranceCard';
import CompareTable from '@/components/insurance/CompareTable';
import FAQ from '@/components/Faq';
import { itemListJSONLD, breadcrumbList, faqPage } from '@/lib/seo/jsonld';

interface PageProps {
  params: { category: string };
}

// Category normalizer
function normalizeCategory(category: string): string {
  const key = category === 'car' ? 'auto' : category;
  if (!['auto', 'medical', 'life'].includes(key)) {
    notFound();
  }
  return key;
}

// Category metadata
const categoryConfig = {
  auto: {
    title: '自動車保険比較',
    description: '自動車保険の保険料や補償内容を比較。対人・対物・車両保険やロードサービスなど、あなたに最適な自動車保険を見つけましょう。',
    icon: '🚗',
    tags: ['対人・対物補償', '車両保険', 'ロードサービス', 'インターネット割引'] as string[],
    faqs: [
      {
        q: "自動車保険の補償内容で重要なものは何ですか？",
        a: "対人・対物賠償責任保険は必須で、できれば無制限にしましょう。車両保険、人身傷害補償保険、ロードサービスも重要な補償です。"
      },
      {
        q: "保険料を安くするにはどうすればいいですか？",
        a: "年齢条件や運転者限定特約の設定、車両保険の免責金額設定、インターネット割引の活用などが効果的です。"
      },
      {
        q: "事故を起こした時の対応は？",
        a: "まず安全確保と警察への連絡、その後保険会社への事故報告を速やかに行います。24時間対応の事故受付サービスを利用しましょう。"
      }
    ] as { q: string; a: string; }[]
  },
  medical: {
    title: '医療保険比較',
    description: '医療保険の入院給付金や手術給付金を比較。先進医療特約や通院保障など、あなたに最適な医療保険を見つけましょう。',
    icon: '🏥',
    tags: ['入院給付金', '手術給付金', '先進医療特約', '通院保障'] as string[],
    faqs: [
      {
        q: "医療保険の入院給付金はいくらに設定すればいいですか？",
        a: "日額5,000円〜10,000円が一般的です。高額療養費制度を考慮し、差額ベッド代や食事代をカバーできる金額に設定しましょう。"
      },
      {
        q: "先進医療特約は必要ですか？",
        a: "保険料は安く、先進医療を受ける際の技術料をカバーできるため、加入をおすすめします。がん治療での重粒子線治療などで活用されています。"
      },
      {
        q: "医療保険の見直し時期は？",
        a: "年齢や家族構成の変化、収入の変化があった時が見直しのタイミングです。特に40代以降は病気のリスクが高まるため定期的な見直しが重要です。"
      }
    ] as { q: string; a: string; }[]
  },
  life: {
    title: '生命保険比較',
    description: '生命保険の死亡保障や解約返戻金を比較。終身保険・定期保険・収入保障保険など、あなたに最適な生命保険を見つけましょう。',
    icon: '👨‍👩‍👧‍👦',
    tags: ['死亡保障', '解約返戻金', '収入保障', '相続対策'] as string[],
    faqs: [
      {
        q: "生命保険の保険金額はどのくらい必要ですか？",
        a: "遺族の生活費、子どもの教育費、住宅ローンの残債などを考慮して設定します。一般的に年収の5〜10倍が目安とされています。"
      },
      {
        q: "終身保険と定期保険の違いは？",
        a: "終身保険は一生涯保障が続き解約返戻金がありますが保険料が高め。定期保険は一定期間の保障で保険料が安いですが解約返戻金はありません。"
      },
      {
        q: "生命保険の見直しはいつすればいいですか？",
        a: "結婚、出産、住宅購入、転職などライフステージの変化時に見直しを検討しましょう。特に子どもの独立後は保険金額を減額できる場合があります。"
      }
    ] as { q: string; a: string; }[]
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const key = normalizeCategory(params.category);
  const config = categoryConfig[key as keyof typeof categoryConfig];
  
  return {
    title: `${config.title} | おすすめ保険の比較・選び方ガイド`,
    description: config.description,
    openGraph: {
      title: `${config.title} | おすすめ保険の比較・選び方ガイド`,
      description: config.description,
      type: 'website',
      url: `https://marlowgate.com/best/insurance/${params.category}`,
    },
    alternates: {
      canonical: `https://marlowgate.com/best/insurance/${params.category}`,
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  const key = normalizeCategory(params.category);
  const config = categoryConfig[key as keyof typeof categoryConfig];

  // Get products for this category, sorted by rating desc, then updatedAt desc
  const products = allInsuranceProducts
    .filter(product => product.category === key)
    .sort((a, b) => {
      if (b.ratingValue !== a.ratingValue) {
        return b.ratingValue - a.ratingValue;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'おすすめ比較', href: '/best' },
    { name: '保険比較', href: '/best/insurance' },
    { name: config.title }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": config.title,
    "description": config.description,
    "url": `https://marlowgate.com/best/insurance/${params.category}`,
    "breadcrumb": breadcrumbList(breadcrumbs.map(b => ({ name: b.name, item: b.href || '' }))),
    "mainEntity": itemListJSONLD(`${config.title}ランキング`, products.map(product => ({
      name: product.title,
      url: `https://marlowgate.com${product.url}`,
      ratingValue: product.ratingValue
    }))),
    "faq": faqPage(config.faqs)
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        <CategoryHero
          title={config.title}
          description={config.description}
          tags={config.tags}
          icon={config.icon}
        />

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '24px',
            color: '#111827'
          }}>
            {config.title}ランキング
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {products.map((product) => (
              <InsuranceCard
                key={product.slug}
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
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            marginBottom: '24px',
            color: '#111827'
          }}>
            {config.title}比較表
          </h2>
          <CompareTable items={products} />
        </section>

        <FAQ items={config.faqs} />

        <section style={{ 
          background: '#f9fafb', 
          padding: '32px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginTop: '48px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#111827'
          }}>
            免責事項
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px', 
            lineHeight: '1.6',
            margin: 0
          }}>
            本サイトの情報は一般的な情報提供を目的としており、個別の保険商品の詳細や最新の保険料については、
            各保険会社の公式サイトや代理店にて必ずご確認ください。保険選びは個人の状況により最適解が異なりますので、
            専門家へのご相談をおすすめします。
          </p>
        </section>
      </Container>
    </>
  );
}