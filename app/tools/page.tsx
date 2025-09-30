import { Metadata } from 'next'
import Container from '@/components/Container'
import Breadcrumbs from '@/components/Breadcrumbs'
import PrRibbon from '@/components/PrRibbon'
import JsonLd from '@/components/JsonLd'
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FX取引ツール | ポジションサイズ・Pip計算・証拠金計算機',
  description: '無料のFX取引ツール集。ポジションサイズ計算機、Pip価値計算機、証拠金計算機で効率的なリスク管理を実現。プロトレーダー愛用の必須ツール。',
  keywords: 'FX ツール,ポジションサイズ 計算,Pip 計算機,証拠金 計算,リスク管理,FX 計算機,外国為替 ツール',
  openGraph: {
    title: 'FX取引ツール | ポジションサイズ・Pip計算・証拠金計算機',
    description: '無料のFX取引ツール集。ポジションサイズ計算機、Pip価値計算機、証拠金計算機で効率的なリスク管理を実現。',
    type: 'website',
    url: 'https://marlowgate.com/tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FX取引ツール | ポジションサイズ・Pip計算・証拠金計算機',
    description: '無料のFX取引ツール集。ポジションサイズ計算機、Pip価値計算機、証拠金計算機で効率的なリスク管理を実現。',
  },
  alternates: {
    canonical: 'https://marlowgate.com/tools',
  },
}

const tools = [
  {
    title: 'ポジションサイズ計算機',
    slug: 'position-size-calculator',
    description: '口座残高とリスク許容度から最適なポジションサイズを計算。効果的なリスク管理の第一歩。',
    icon: '📊',
    category: 'リスク管理',
    features: ['口座残高入力', 'リスク%設定', 'ストップロス設定', '最適ロット数算出']
  },
  {
    title: 'Pip価値計算機',
    slug: 'pip-value-calculator', 
    description: '通貨ペアとロット数から1pipの価値を正確に計算。損益計算の基礎ツール。',
    icon: '💱',
    category: '価値計算',
    features: ['通貨ペア選択', 'ロット数入力', '口座通貨対応', 'リアルタイム計算']
  },
  {
    title: '証拠金計算機',
    slug: 'margin-calculator',
    description: 'レバレッジと取引量から必要証拠金を算出。口座管理の必須ツール。',
    icon: '🏦',
    category: '証拠金管理',
    features: ['レバレッジ設定', '取引量入力', '証拠金率計算', '余力確認']
  }
]

export default function ToolsPage() {
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'ツール', href: '/tools' },
  ]

  // JSON-LD for tools collection
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'FX取引ツール',
    description: '無料のFX取引ツール集。ポジションサイズ計算機、Pip価値計算機、証拠金計算機で効率的なリスク管理を実現。',
    url: 'https://marlowgate.com/tools',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        '@type': 'SoftwareApplication',
        position: index + 1,
        name: tool.title,
        description: tool.description,
        url: `https://marlowgate.com/tools/${tool.slug}`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY'
        }
      }))
    }
  }

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            FX取引ツール
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            プロトレーダー愛用の必須ツールで効率的なリスク管理を実現。すべて無料でご利用いただけます。
          </p>
        </header>

        {/* Tools Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link 
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {tool.title}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">主な機能:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      ツールを使用 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Guide Links Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">関連ガイド</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/guides/risk-management"
              className="group block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 hover:border-blue-200 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                📚 リスク管理の基礎
              </h3>
              <p className="text-gray-600 mb-3">
                ポジションサイズ計算とリスク管理の基本原則を詳しく解説。初心者必読のガイド。
              </p>
              <span className="text-blue-600 text-sm font-medium">
                ガイドを読む →
              </span>
            </Link>
            
            <Link 
              href="/guides/margin-trading"
              className="group block bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100 hover:border-green-200 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                🏦 証拠金取引の仕組み
              </h3>
              <p className="text-gray-600 mb-3">
                レバレッジと証拠金の関係、効果的な資金管理方法を分かりやすく説明。
              </p>
              <span className="text-green-600 text-sm font-medium">
                ガイドを読む →
              </span>
            </Link>
          </div>
        </section>

        {/* Why Use These Tools */}
        <section className="mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              なぜこれらのツールが必要なのか？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">🎯 正確な計算</h3>
                <p className="text-gray-600">
                  手動計算のミスを防ぎ、常に正確なポジションサイズと証拠金を把握できます。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">⚡ 時間節約</h3>
                <p className="text-gray-600">
                  複雑な計算を瞬時に処理し、取引判断により多くの時間を集中できます。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">📈 リスク管理</h3>
                <p className="text-gray-600">
                  一貫したリスク管理により、長期的な収益性向上を支援します。
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}