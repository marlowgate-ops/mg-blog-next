import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import JsonLd from '@/components/JsonLd';
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrRibbon from '@/components/PrRibbon';
import MDXRenderer from '@/components/MDXRenderer';
import FAQ from '@/components/Faq';
import RelatedPosts from '@/components/RelatedPosts';
import { allBrokers } from 'contentlayer/generated';
import RatingStars from '@/components/brokers/RatingStars';
import KeyFacts from '@/components/brokers/KeyFacts';
import SpreadsTable from '@/components/brokers/SpreadsTable';
import ProsCons from '@/components/ProsCons';
import PrimaryCta from '@/components/PrimaryCta';
import s from './page.module.css';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return allBrokers.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const broker = allBrokers.find((b) => b.slug === params.slug);
  
  if (!broker) {
    return {
      title: 'ブローカーが見つかりません',
    };
  }

  const ogImageUrl = `/api/og?type=broker&title=${encodeURIComponent(broker.name)}&subtitle=${encodeURIComponent(`${broker.country}のFXブローカー`)}&score=${broker.ratingValue}`

  return {
    title: `${broker.name} - FXブローカー詳細レビュー | 評価・スプレッド・安全性`,
    description: `${broker.name}の詳細レビュー。スプレッド、手数料、安全性、取引プラットフォームなど、実際の評価とユーザーレビューをご紹介。`,
    openGraph: {
      title: `${broker.name} - FXブローカー詳細レビュー`,
      description: `${broker.name}の詳細レビュー。スプレッド、手数料、安全性、取引プラットフォームなど、実際の評価とユーザーレビューをご紹介。`,
      type: 'article',
      url: `https://marlowgate.com${broker.url}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${broker.name} - FXブローカー詳細レビュー`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${broker.name} - FXブローカー詳細レビュー`,
      description: `${broker.name}の詳細レビュー。評価: ${broker.ratingValue}/5.0`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://marlowgate.com${broker.url}`,
    },
  };
}

export default function BrokerPage({ params }: PageProps) {
  const broker = allBrokers.find((b) => b.slug === params.slug);

  if (!broker) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'FXブローカー', href: '/brokers' },
    { name: broker.name }
  ];

  const faqs = [
    {
      q: `${broker.name}の最低入金額はいくらですか？`,
      a: "最低入金額については、公式サイトで最新の情報をご確認ください。多くの国内FX会社では最低入金額の設定はありませんが、初回入金額の推奨額が設定されている場合があります。"
    },
    {
      q: `${broker.name}はスキャルピング取引が可能ですか？`,
      a: "スキャルピング取引の可否については、各社の取引ルールにより異なります。短時間での売買を繰り返す取引を行う前に、必ず利用規約を確認してください。"
    },
    {
      q: `${broker.name}のデモ口座はありますか？`,
      a: "多くのFX会社ではデモ口座を提供しています。取引プラットフォームの操作感やスプレッドの確認ができるため、実際の取引前にデモ口座でのお試しをおすすめします。"
    }
  ];

  const relatedBrokers = allBrokers
    .filter(b => b.slug !== broker.slug)
    .slice(0, 3)
    .map(b => ({
      title: b.name,
      url: b.url,
      date: b.updatedAt,
      description: `${b.name}の詳細レビュー・評価`
    }));

  // JSON-LD structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": broker.name,
    "url": `https://marlowgate.com${broker.url}`,
    "description": `${broker.name}のFXブローカー詳細情報`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": broker.country
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": broker.ratingValue,
      "reviewCount": broker.ratingCount,
      "bestRating": 5,
      "worstRating": 1
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        {/* Hero Section */}
        <div className={s.hero}>
          <div className={s.heroContent}>
            <h1 className={s.heroTitle}>{broker.name}</h1>
            <div className={s.heroMeta}>
              <RatingStars 
                value={broker.ratingValue} 
                count={broker.ratingCount} 
                size="large"
              />
              <div className={s.safetyScore}>
                <span className={s.safetyLabel}>安全性スコア:</span>
                <span className={`${s.safetyValue} ${getSafetyClass(broker.safetyScore)}`}>
                  {broker.safetyScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Facts */}
        <KeyFacts
          country={broker.country}
          regulators={broker.regulators}
          safetyScore={broker.safetyScore}
          platforms={broker.platforms}
          funding={broker.funding}
        />

        {/* Spreads & Fees */}
        <SpreadsTable
          spreads={broker.spreads}
          feesNote={broker.feesNote}
        />

        {/* Pros & Cons */}
        <ProsCons pros={broker.pros} cons={broker.cons} />

        {/* CTA */}
        <PrimaryCta
          href={broker.ctaUrl}
          label={broker.ctaLabel}
        />

        {/* Long Form Content */}
        <div className={s.content}>
          <MDXRenderer code={broker.body.code} />
        </div>

        {/* FAQ */}
        <FAQ items={faqs} />

        {/* Related Brokers */}
        {relatedBrokers.length > 0 && (
          <RelatedPosts items={relatedBrokers} />
        )}
      </Container>
    </>
  );
}

function getSafetyClass(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'fair';
  return 'poor';
}