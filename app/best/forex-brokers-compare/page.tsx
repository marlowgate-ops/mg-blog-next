import { Metadata } from 'next'
import Container from '@/components/Container'
import Breadcrumbs from '@/components/Breadcrumbs'
import PrRibbon from '@/components/PrRibbon'
import JsonLd from '@/components/JsonLd'
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs'
import { itemListJSONLD } from '@/lib/seo/jsonld'
import { getAllBrokers } from '@/lib/score/brokers'
import BrokerCompareTableV2 from '@/components/BrokerCompareTableV2'

export const metadata: Metadata = {
  title: 'FXブローカー比較 | 2024年最新ランキング',
  description: '日本のFXブローカーを5軸で徹底比較。コスト、プラットフォーム、約定力、サポート、教育の透明なスコアリングで最適なFX業者を見つけよう。',
  keywords: 'FX ブローカー 比較,FX 業者 ランキング,外国為替 口座 比較,FX スプレッド 比較,FX 手数料 比較',
  openGraph: {
    title: 'FXブローカー比較 | 2024年最新ランキング',
    description: '日本のFXブローカーを5軸で徹底比較。コスト、プラットフォーム、約定力、サポート、教育の透明なスコアリングで最適なFX業者を見つけよう。',
    type: 'website',
    url: 'https://marlowgate.com/best/forex-brokers-compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FXブローカー比較 | 2024年最新ランキング',
    description: '日本のFXブローカーを5軸で徹底比較。透明なスコアリングで最適なFX業者を見つけよう。',
  },
  alternates: {
    canonical: 'https://marlowgate.com/best/forex-brokers-compare',
  },
}

export default function BrokerComparePage() {
  const brokers = getAllBrokers()
  
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'ベスト', href: '/best' },
    { name: 'FXブローカー比較', href: '/best/forex-brokers-compare' },
  ]

  // JSON-LD structured data for broker comparison
  const jsonLdData = itemListJSONLD(
    'FXブローカー比較一覧',
    brokers.map((broker) => ({
      name: broker.brand,
      url: `https://marlowgate.com/best/forex-brokers/${broker.slug}`,
      ratingValue: broker.score_total
    }))
  )

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            FXブローカー比較
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            日本のFXブローカーを5軸で徹底比較。透明なスコアリング手法で最適なFX業者を見つけましょう。
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            評価方法について
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              各ブローカーは以下の5つの軸で評価され、総合スコアが算出されます：
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>コスト (30%)</strong>: スプレッド、手数料、スワップポイント</li>
              <li><strong>プラットフォーム (25%)</strong>: 取引ツール、アプリ、安定性</li>
              <li><strong>約定力 (20%)</strong>: 注文執行の速度と精度</li>
              <li><strong>サポート (15%)</strong>: カスタマーサービス、教育リソース</li>
              <li><strong>教育 (10%)</strong>: 学習コンテンツ、市場分析</li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              すべてのスコアは公開データと実際の利用体験に基づいて算出されています。
            </p>
          </div>
        </section>

        <BrokerCompareTableV2 brokers={brokers} />
        
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ブローカー選びのポイント
          </h2>
          <div className="prose max-w-none">
            <p>
              FXブローカーを選ぶ際は、単純にスプレッドの狭さだけでなく、総合的な取引環境を考慮することが重要です。
              取引スタイルや経験レベルに応じて、重視すべきポイントが変わります。
            </p>
            <ul>
              <li><strong>初心者の方</strong>: 教育リソース、サポート体制、少額取引の可否</li>
              <li><strong>デイトレーダー</strong>: スプレッド、約定力、取引ツールの機能性</li>
              <li><strong>長期投資家</strong>: スワップポイント、口座維持費用、通貨ペアの豊富さ</li>
            </ul>
          </div>
        </section>
      </Container>
    </>
  )
}