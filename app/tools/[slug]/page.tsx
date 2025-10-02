import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import Breadcrumbs from '@/components/Breadcrumbs'
import PrRibbon from '@/components/PRRibbon'
import JsonLd from '@/components/JsonLd'
import JsonLdBreadcrumbs from '@/components/JsonLdBreadcrumbs'
import PositionSizeCalculator from '@/components/tools/PositionSizeCalculator'
import PipValueCalculator from '@/components/tools/PipValueCalculator'
import MarginCalculator from '@/components/tools/MarginCalculator'
import Link from 'next/link'

interface Props {
  params: {
    slug: string
  }
}

const tools = {
  'position-size-calculator': {
    title: 'ポジションサイズ計算機',
    description: '口座残高とリスク許容度から最適なポジションサイズを計算。効果的なリスク管理の第一歩。',
    longDescription: 'このツールは、あなたの口座残高、リスク許容度、ストップロスの幅から最適なポジションサイズ（ロット数）を自動計算します。一貫したリスク管理により、長期的な収益性向上を支援します。',
    component: PositionSizeCalculator,
    guideLinks: [
      { title: 'リスク管理の基礎', href: '/guides/risk-management' },
      { title: 'ポジションサイジングの重要性', href: '/guides/position-sizing' }
    ]
  },
  'pip-value-calculator': {
    title: 'Pip価値計算機',
    description: '通貨ペアとロット数から1pipの価値を正確に計算。損益計算の基礎ツール。',
    longDescription: '通貨ペア、ロット数、口座通貨を入力するだけで、1pipの価値を正確に計算します。異なる通貨ペアでの取引時に、損益を事前に把握するのに役立ちます。',
    component: PipValueCalculator,
    guideLinks: [
      { title: 'Pipとは何か？', href: '/guides/what-is-pip' },
      { title: '損益計算の基礎', href: '/guides/profit-loss-calculation' }
    ]
  },
  'margin-calculator': {
    title: '証拠金計算機',
    description: 'レバレッジと取引量から必要証拠金を算出。口座管理の必須ツール。',
    longDescription: 'レバレッジ、取引量、通貨ペアから必要証拠金を計算します。口座の余力を事前に確認し、効果的な資金管理を実現できます。',
    component: MarginCalculator,
    guideLinks: [
      { title: '証拠金取引の仕組み', href: '/guides/margin-trading' },
      { title: 'レバレッジの使い方', href: '/guides/leverage-usage' }
    ]
  }
}

// Generate static params for all tool slugs
export async function generateStaticParams() {
  return Object.keys(tools).map((slug) => ({
    slug,
  }))
}

// Generate metadata for each tool page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = tools[params.slug as keyof typeof tools]

  if (!tool) {
    return {
      title: 'ツールが見つかりません | Marlow Gate',
    }
  }

  return {
    title: `${tool.title} | FX取引ツール`,
    description: tool.description,
    keywords: `${tool.title},FX ツール,FX 計算機,外国為替 ツール,リスク管理,取引ツール`,
    openGraph: {
      title: `${tool.title} | FX取引ツール`,
      description: tool.description,
      type: 'website',
      url: `https://marlowgate.com/tools/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.title} | FX取引ツール`,
      description: tool.description,
    },
    alternates: {
      canonical: `https://marlowgate.com/tools/${params.slug}`,
    },
  }
}

export default function ToolPage({ params }: Props) {
  const tool = tools[params.slug as keyof typeof tools]

  if (!tool) {
    notFound()
  }

  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
    { name: 'ツール', href: '/tools' },
    { name: tool.title, href: `/tools/${params.slug}` },
  ]

  // JSON-LD for individual tool
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    url: `https://marlowgate.com/tools/${params.slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
      description: '無料で利用可能'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Marlow Gate',
      url: 'https://marlowgate.com'
    },
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'ja-JP'
  }

  const ToolComponent = tool.component

  return (
    <>
      <JsonLd data={jsonLdData} />
      <JsonLdBreadcrumbs />
      
      <Container>
        <PrRibbon />
        <Breadcrumbs items={breadcrumbs} />
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {tool.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {tool.longDescription}
          </p>
        </header>

        {/* Tool Component */}
        <section className="mb-12">
          <ToolComponent />
        </section>

        {/* Related Guides */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">関連ガイド</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tool.guideLinks.map((guide, index) => (
              <Link 
                key={index}
                href={guide.href}
                className="group block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 hover:border-blue-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  📚 {guide.title}
                </h3>
                <span className="text-blue-600 text-sm font-medium">
                  ガイドを読む →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Tools */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">その他のツール</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tools)
              .filter(([slug]) => slug !== params.slug)
              .map(([slug, otherTool]) => (
                <Link 
                  key={slug}
                  href={`/tools/${slug}`}
                  className="group block bg-white rounded-lg p-4 border hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 mb-2">
                    {otherTool.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {otherTool.description}
                  </p>
                </Link>
              ))}
          </div>
        </section>

        {/* Back to Tools */}
        <section className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← すべてのツールを見る
          </Link>
        </section>
      </Container>
    </>
  )
}