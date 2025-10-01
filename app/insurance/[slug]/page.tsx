import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInsuranceProduct, loadInsuranceProducts } from '../../../lib/insurance-data';
import PrBadge from '../../../components/PrBadge';
import JsonLd from '../../../components/JsonLd';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = loadInsuranceProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getInsuranceProduct(params.slug);
  
  if (!product) {
    return {
      title: '保険商品詳細 - Marlow Gate',
    };
  }

  const title = `${product.brand} ${product.category === 'life' ? '生命保険' : 
                                   product.category === 'medical' ? '医療保険' :
                                   product.category === 'auto' ? '自動車保険' :
                                   product.category === 'property' ? '火災保険' : '旅行保険'} 詳細レビュー`;
  const description = `${product.brand}の保険商品を詳細レビュー。保険料${product.premium_from.toLocaleString()}円から。${product.coverage.slice(0, 3).join('、')}などの保障内容、申込方法、メリット・デメリットを詳しく解説。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/insurance/${params.slug}`,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

export default function InsuranceProfilePage({ params }: PageProps) {
  const product = getInsuranceProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  const categoryLabels = {
    life: '生命保険',
    medical: '医療保険',
    auto: '自動車保険',
    property: '火災保険',
    travel: '旅行保険',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-lg font-medium text-gray-900">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const specData = [
    { label: '保険会社', value: product.brand },
    { label: '保険種類', value: categoryLabels[product.category] },
    { label: '月額保険料', value: `${formatCurrency(product.premium_from)}〜` },
    ...(product.deductible ? [{ label: '免責金額', value: formatCurrency(product.deductible) }] : []),
    { label: '加入年齢', value: `${product.age_range.min}〜${product.age_range.max}歳` },
    { label: '申込方法', value: product.apply_methods.map(m => {
      return m === 'online' ? 'オンライン' :
             m === 'phone' ? '電話' :
             m === 'agent' ? '代理店' : '郵送';
    }).join('、') },
    ...(product.established_year ? [{ label: '設立年', value: `${product.established_year}年` }] : []),
    ...(product.customer_base ? [{ label: '契約者数', value: `約${(product.customer_base / 10000).toFixed(0)}万人` }] : []),
  ];

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${product.brand} ${categoryLabels[product.category]}`,
    description: product.notes || `${product.brand}の${categoryLabels[product.category]}商品`,
    provider: {
      '@type': 'Organization',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.premium_from,
      priceCurrency: 'JPY',
      url: product.urls.official,
    },
    ...(product.score_total && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.score_total,
        bestRating: 5,
        worstRating: 1,
      }
    }),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    ホーム
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href="/insurance" className="ml-4 text-gray-400 hover:text-gray-500">
                      保険
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href={`/insurance/compare/${product.category}`} className="ml-4 text-gray-400 hover:text-gray-500">
                      {categoryLabels[product.category]}
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-gray-500">{product.brand}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {categoryLabels[product.category]}
                  </span>
                  {product.company_size === 'large' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      大手
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl" data-testid="insurance-name">
                  {product.brand}
                </h1>
                
                {product.notes && (
                  <p className="mt-4 text-lg text-gray-600">
                    {product.notes}
                  </p>
                )}

                <div className="mt-6 flex items-center space-x-6">
                  <div>
                    <div className="text-sm text-gray-500">月額保険料</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.premium_from)}〜
                    </div>
                  </div>
                  
                  {product.score_total && (
                    <div data-testid="insurance-rating">
                      <div className="text-sm text-gray-500">総合評価</div>
                      {renderStars(product.score_total)}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href={product.urls.official}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    data-testid="insurance-official-button"
                  >
                    公式サイトで詳細を見る
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                  
                  <a
                    href={product.urls.apply}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    data-testid="insurance-apply-button"
                  >
                    申込・見積もり
                  </a>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <PrBadge />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              {/* Coverage */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8" data-testid="insurance-coverage">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">保障内容</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.coverage.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              {product.exclusions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">免責事項</h2>
                  <div className="space-y-2">
                    {product.exclusions.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Features */}
              {product.special_features && product.special_features.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">特徴・サービス</h2>
                  <div className="space-y-3">
                    {product.special_features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Breakdown */}
              {product.scores && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8" data-testid="rating-breakdown">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">評価詳細</h2>
                  <div className="space-y-4">
                    {product.scores.cost && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">コスト</span>
                        {renderStars(product.scores.cost)}
                      </div>
                    )}
                    {product.scores.coverage && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">保障内容</span>
                        {renderStars(product.scores.coverage)}
                      </div>
                    )}
                    {product.scores.service && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">サービス</span>
                        {renderStars(product.scores.service)}
                      </div>
                    )}
                    {product.scores.claim && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">請求対応</span>
                        {renderStars(product.scores.claim)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Spec Table */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8" data-testid="insurance-specs-table">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                <div className="space-y-3">
                  {specData.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium" data-testid="spec-label">{spec.label}</span>
                      <span className="text-gray-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Apply */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">申込・相談</h3>
                <div className="space-y-3">
                  <a
                    href={product.urls.apply}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    オンライン申込
                  </a>
                  <a
                    href={product.urls.official}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
                  >
                    資料請求・相談
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}