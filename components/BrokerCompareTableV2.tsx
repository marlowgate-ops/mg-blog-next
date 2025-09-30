'use client'

import { useState, useMemo } from 'react'
import { BrokerData } from '@/content_source/brokers/brokers.schema'
import { filterBrokers, sortBrokers, getAverageSpread } from '@/lib/score/brokers'
import AffLink from '@/components/AffLink'
import Stars from '@/components/Stars'

interface BrokerCompareTableV2Props {
  brokers: BrokerData[]
}

type SortField = 'score_total' | 'spread_avg' | 'min_deposit' | 'leverage_max' | 'brand'
type SortDirection = 'asc' | 'desc'

export default function BrokerCompareTableV2({ brokers }: BrokerCompareTableV2Props) {
  const [sortField, setSortField] = useState<SortField>('score_total')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [platformFilter, setPlatformFilter] = useState<string[]>([])
  const [regulatorFilter, setRegulatorFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Get unique platforms and regulators for filters
  const allPlatforms = useMemo(() => {
    const platforms = new Set<string>()
    brokers.forEach(broker => {
      broker.platforms.forEach(platform => platforms.add(platform))
    })
    return Array.from(platforms).sort()
  }, [brokers])

  const allRegulators = useMemo(() => {
    const regulators = new Set<string>()
    brokers.forEach(broker => {
      broker.regulator.forEach(reg => regulators.add(reg))
    })
    return Array.from(regulators).sort()
  }, [brokers])

  // Filter and sort brokers
  const processedBrokers = useMemo(() => {
    const filtered = filterBrokers(brokers, {
      platforms: platformFilter.length > 0 ? platformFilter : undefined,
      regulator: regulatorFilter.length > 0 ? regulatorFilter : undefined,
      search: searchQuery || undefined,
    })
    
    return sortBrokers(filtered, sortField, sortDirection)
  }, [brokers, platformFilter, regulatorFilter, searchQuery, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const togglePlatformFilter = (platform: string) => {
    setPlatformFilter(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const toggleRegulatorFilter = (regulator: string) => {
    setRegulatorFilter(prev => 
      prev.includes(regulator) 
        ? prev.filter(r => r !== regulator)
        : [...prev, regulator]
    )
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">絞り込み</h3>
        
        {/* Search */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            ブローカー名で検索
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ブローカー名を入力..."
          />
        </div>

        {/* Platform Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">取引プラットフォーム</h4>
          <div className="flex flex-wrap gap-2">
            {allPlatforms.map(platform => (
              <button
                key={platform}
                onClick={() => togglePlatformFilter(platform)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  platformFilter.includes(platform)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Regulator Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">規制機関</h4>
          <div className="flex flex-wrap gap-2">
            {allRegulators.map(regulator => (
              <button
                key={regulator}
                onClick={() => toggleRegulatorFilter(regulator)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  regulatorFilter.includes(regulator)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {regulator}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {processedBrokers.length} 件中 {processedBrokers.length} 件を表示
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('brand')}
                >
                  ブローカー {getSortIcon('brand')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('score_total')}
                >
                  総合スコア {getSortIcon('score_total')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('spread_avg')}
                >
                  平均スプレッド {getSortIcon('spread_avg')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('min_deposit')}
                >
                  最小入金額 {getSortIcon('min_deposit')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('leverage_max')}
                >
                  最大レバレッジ {getSortIcon('leverage_max')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  取引開始
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedBrokers.map((broker) => (
                <tr key={broker.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {broker.brand}
                        </div>
                        <div className="text-sm text-gray-500">
                          {broker.regulator.join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Stars score={broker.score_total} />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {broker.score_total.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAverageSpread(broker.spread_typical).toFixed(1)} pips
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {broker.min_deposit === 0 ? '制限なし' : `¥${broker.min_deposit.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {broker.leverage_max}倍
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <AffLink
                      href={broker.urls.official}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      data-broker={broker.slug}
                    >
                      口座開設
                    </AffLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly card view for smaller screens */}
      <div className="md:hidden space-y-4">
        {processedBrokers.map((broker) => (
          <div key={broker.slug} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{broker.brand}</h3>
                <p className="text-sm text-gray-500">{broker.regulator.join(', ')}</p>
              </div>
              <div className="flex items-center">
                <Stars score={broker.score_total} />
                <span className="ml-1 text-sm font-medium">{broker.score_total.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="text-gray-500">平均スプレッド:</span>
                <span className="ml-1 font-medium">{getAverageSpread(broker.spread_typical).toFixed(1)} pips</span>
              </div>
              <div>
                <span className="text-gray-500">最小入金額:</span>
                <span className="ml-1 font-medium">
                  {broker.min_deposit === 0 ? '制限なし' : `¥${broker.min_deposit.toLocaleString()}`}
                </span>
              </div>
              <div>
                <span className="text-gray-500">最大レバレッジ:</span>
                <span className="ml-1 font-medium">{broker.leverage_max}倍</span>
              </div>
            </div>
            
            <AffLink
              href={broker.urls.official}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              data-broker={broker.slug}
            >
              口座開設
            </AffLink>
          </div>
        ))}
      </div>
    </div>
  )
}