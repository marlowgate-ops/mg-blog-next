import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import Breadcrumbs from '@/components/Breadcrumbs'
import PrRibbon from '@/components/PrRibbon'
import JsonLd from '@/components/JsonLd'
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs'
import { getAllBrokers } from '@/lib/score/brokers'
import AffLink from '@/components/AffLink'
import Stars from '@/components/Stars'
import { getAverageSpread } from '@/lib/score/brokers'

interface Props {
  params: {
    slug: string
  }
}

// Generate static params for all broker slugs
export async function generateStaticParams() {
  const brokers = getAllBrokers()
  return brokers.map((broker) => ({
    slug: broker.slug,
  }))
}

// Generate metadata for each broker page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brokers = getAllBrokers()
  const broker = brokers.find((b) => b.slug === params.slug)

  if (!broker) {
    return {
      title: 'ブローカーが見つかりません | Marlow Gate',
    }
  }

  return {
    title: `${broker.brand}のレビュー・評価 | FXブローカー詳細`,
    description: `${broker.brand}の詳細レビュー。スプレッド、手数料、プラットフォーム、サポートを徹底分析。総合評価${broker.score_total.toFixed(1)}/5.0`,
    keywords: `${broker.brand},FX ブローカー,FX 業者,レビュー,評価,スプレッド,手数料`,
    openGraph: {
      title: `${broker.brand}のレビュー・評価`,
      description: `${broker.brand}の詳細レビュー。総合評価${broker.score_total.toFixed(1)}/5.0`,
      type: 'article',
      url: `https://marlowgate.com/best/forex-brokers/${broker.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${broker.brand}のレビュー・評価`,
      description: `${broker.brand}の詳細レビュー。総合評価${broker.score_total.toFixed(1)}/5.0`,
    },
    alternates: {
      canonical: `https://marlowgate.com/best/forex-brokers/${broker.slug}`,
    },
  }
}

export default function BrokerProfilePage({ params }: Props) {
  const brokers = getAllBrokers()
  const broker = brokers.find((b) => b.slug === params.slug)

  if (!broker) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'ベスト', href: '/best' },
    { name: 'FXブローカー比較', href: '/best/forex-brokers-compare' },
    { name: broker.brand, href: `/best/forex-brokers/${broker.slug}` },
  ]

  // JSON-LD structured data for individual broker
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: broker.brand,
    description: `${broker.brand}のFXサービス詳細情報`,
    url: `https://marlowgate.com/best/forex-brokers/${broker.slug}`,
    sameAs: broker.urls.official,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: broker.score_total,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
    offers: {
      '@type': 'Offer',
      url: broker.urls.official,
      priceCurrency: 'JPY',
      price: broker.min_deposit,
      description: `最小入金額: ${broker.min_deposit === 0 ? '制限なし' : `¥${broker.min_deposit.toLocaleString()}`}`,
    },
  }

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        {/* Hero Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {broker.brand}
                </h1>
                <p className="text-lg text-gray-600">
                  {broker.regulator.join('・')} 規制下のFXブローカー
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="flex items-center justify-end mb-2">
                  <Stars score={broker.score_total} />
                  <span className="ml-2 text-2xl font-bold text-gray-900">
                    {broker.score_total.toFixed(1)}
                  </span>
                  <span className="text-gray-500">/5.0</span>
                </div>
                <AffLink
                  href={broker.urls.official}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  data-broker={broker.slug}
                >
                  口座開設
                </AffLink>
              </div>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-1">平均スプレッド</h3>
              <p className="text-2xl font-bold text-gray-900">
                {getAverageSpread(broker.spread_typical).toFixed(1)} pips
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-1">最小入金額</h3>
              <p className="text-2xl font-bold text-gray-900">
                {broker.min_deposit === 0 ? '制限なし' : `¥${broker.min_deposit.toLocaleString()}`}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-1">最大レバレッジ</h3>
              <p className="text-2xl font-bold text-gray-900">
                {broker.leverage_max}倍
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500 mb-1">通貨ペア数</h3>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(broker.spread_typical).length}ペア
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Scores */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">詳細評価</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">コスト (30%)</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(broker.scores.cost / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold w-8">
                    {broker.scores.cost.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">プラットフォーム (25%)</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(broker.scores.platform / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold w-8">
                    {broker.scores.platform.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">約定力 (20%)</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(broker.scores.execution / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold w-8">
                    {broker.scores.execution.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">サポート (15%)</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(broker.scores.support / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold w-8">
                    {broker.scores.support.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">教育 (10%)</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(broker.scores.education / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold w-8">
                    {broker.scores.education.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spread Details */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">スプレッド詳細</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    通貨ペア
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標準スプレッド
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(broker.spread_typical).map(([pair, spread]) => (
                  <tr key={pair}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pair}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {spread} pips
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Platform Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">取引プラットフォーム</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-wrap gap-2">
              {broker.platforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Fees Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">手数料情報</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">取引手数料</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">入金手数料:</span>
                    <span className="font-medium">
                      {broker.fees.deposit === 0 ? '無料' : `${broker.fees.deposit}円`}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">その他手数料</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">出金手数料:</span>
                    <span className="font-medium">
                      {broker.fees.withdrawal === 0 ? '無料' : `${broker.fees.withdrawal}円`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">スワップ手数料:</span>
                    <span className="font-medium">
                      {broker.fees.overnight === 0 ? '無料' : `${broker.fees.overnight}円`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {broker.brand}で取引を始める
            </h2>
            <p className="text-gray-600 mb-4">
              総合評価{broker.score_total.toFixed(1)}/5.0の{broker.brand}で、あなたのFX取引を始めませんか？
            </p>
            <AffLink
              href={broker.urls.official}
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              data-broker={broker.slug}
            >
              公式サイトで口座開設
            </AffLink>
          </div>
        </section>
      </Container>
    </>
  )
}