'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InsuranceProduct, InsuranceCategory, InsuranceCompareFilters } from '../../../../content_source/insurance/insurance.schema';

interface Props {
  category: InsuranceCategory;
  categoryLabel: string;
  initialProducts: InsuranceProduct[];
  coverageOptions: string[];
  applyMethodOptions: { value: string; label: string }[];
  initialFilters: InsuranceCompareFilters;
}

export default function InsuranceCompareClient({
  category,
  categoryLabel,
  initialProducts,
  coverageOptions,
  applyMethodOptions,
  initialFilters,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<InsuranceProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<InsuranceCompareFilters>(initialFilters);

  // Update URL when filters change
  const updateURL = (newFilters: InsuranceCompareFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.coverage && newFilters.coverage.length > 0) {
      params.set('coverage', newFilters.coverage.join(','));
    }
    if (newFilters.age_range?.min) {
      params.set('age_min', newFilters.age_range.min.toString());
    }
    if (newFilters.age_range?.max) {
      params.set('age_max', newFilters.age_range.max.toString());
    }
    if (newFilters.deductible_max) {
      params.set('deductible_max', newFilters.deductible_max.toString());
    }
    if (newFilters.premium_max) {
      params.set('premium_max', newFilters.premium_max.toString());
    }
    if (newFilters.apply_methods && newFilters.apply_methods.length > 0) {
      params.set('apply_methods', newFilters.apply_methods.join(','));
    }
    if (newFilters.sort) {
      params.set('sort', newFilters.sort);
    }
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }

    const newURL = `/insurance/compare/${category}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newURL, { scroll: false });
  };

  // Apply filters
  const applyFilters = async (newFilters: InsuranceCompareFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    
    try {
      const response = await fetch('/api/insurance/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFilters),
      });
      
      if (response.ok) {
        const filteredProducts = await response.json();
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Failed to filter products:', error);
      // Fallback to client-side filtering
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
    
    updateURL(newFilters);
  };

  const handleCoverageChange = (coverage: string, checked: boolean) => {
    const newCoverage = checked
      ? [...(filters.coverage || []), coverage]
      : (filters.coverage || []).filter(c => c !== coverage);
    
    applyFilters({ ...filters, coverage: newCoverage });
  };

  const handleSortChange = (sort: string) => {
    applyFilters({ ...filters, sort: sort as any });
  };

  const handleSearchChange = (search: string) => {
    applyFilters({ ...filters, search });
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
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索
            </label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ブランド名、保障内容で検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              並び順
            </label>
            <select
              value={filters.sort || ''}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">デフォルト</option>
              <option value="cost_asc">保険料（安い順）</option>
              <option value="cost_desc">保険料（高い順）</option>
              <option value="score_desc">評価（高い順）</option>
              <option value="coverage_desc">保障内容（充実順）</option>
              <option value="brand_asc">ブランド名（あいうえお順）</option>
            </select>
          </div>

          {/* Premium Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月額保険料上限
            </label>
            <input
              type="number"
              value={filters.premium_max || ''}
              onChange={(e) => applyFilters({ ...filters, premium_max: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年齢範囲
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.age_range?.min || ''}
                onChange={(e) => applyFilters({ 
                  ...filters, 
                  age_range: { 
                    ...filters.age_range, 
                    min: e.target.value ? parseInt(e.target.value) : undefined 
                  } 
                })}
                placeholder="最小"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={filters.age_range?.max || ''}
                onChange={(e) => applyFilters({ 
                  ...filters, 
                  age_range: { 
                    ...filters.age_range, 
                    max: e.target.value ? parseInt(e.target.value) : undefined 
                  } 
                })}
                placeholder="最大"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Coverage Options */}
        {coverageOptions.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              保障内容
            </label>
            <div className="flex flex-wrap gap-2">
              {coverageOptions.slice(0, 8).map((coverage) => (
                <label key={coverage} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.coverage || []).includes(coverage)}
                    onChange={(e) => handleCoverageChange(coverage, e.target.checked)}
                    className="mr-2 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{coverage}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          {isLoading ? '検索中...' : `${products.length}件の${categoryLabel}が見つかりました`}
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" data-testid="insurance-compare-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  保険会社
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  月額保険料
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  評価
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  主な保障
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年齢制限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申込方法
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詳細
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr 
                  key={product.slug} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  data-testid="insurance-table-row"
                  data-insurance-slug={product.slug}
                  onClick={() => router.push(`/insurance/${product.slug}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900" data-testid="insurance-brand">
                        {product.brand}
                      </div>
                      {product.company_size && (
                        <div className="text-sm text-gray-500">
                          {product.company_size === 'large' ? '大手' : 
                           product.company_size === 'medium' ? '中堅' : '小規模'}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.premium_from)}〜
                    </div>
                    {product.deductible && (
                      <div className="text-sm text-gray-500">
                        免責: {formatCurrency(product.deductible)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.score_total ? renderStars(product.score_total) : (
                      <span className="text-sm text-gray-500">評価なし</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {product.coverage.slice(0, 3).join('、')}
                      {product.coverage.length > 3 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.age_range.min}〜{product.age_range.max}歳
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {product.apply_methods.map((method) => (
                        <span
                          key={method}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {method === 'online' ? 'ネット' :
                           method === 'phone' ? '電話' :
                           method === 'agent' ? '代理店' : '郵送'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/insurance/${product.slug}`}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      詳細を見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              条件に合う保険が見つかりませんでした。
            </p>
            <p className="text-gray-400 mt-2">
              検索条件を変更してお試しください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}