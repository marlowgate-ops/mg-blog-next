'use client'

import { useState, useCallback } from 'react'

interface CalculationResult {
  pipValueBase: number
  pipValueAccount: number
  totalValue: number
}

const commonCurrencyPairs = [
  { pair: 'USDJPY', baseUnit: 100000, pipDigit: 2 },
  { pair: 'EURUSD', baseUnit: 100000, pipDigit: 4 },
  { pair: 'GBPJPY', baseUnit: 100000, pipDigit: 2 },
  { pair: 'AUDJPY', baseUnit: 100000, pipDigit: 2 },
  { pair: 'EURJPY', baseUnit: 100000, pipDigit: 2 },
  { pair: 'GBPUSD', baseUnit: 100000, pipDigit: 4 },
  { pair: 'AUDUSD', baseUnit: 100000, pipDigit: 4 },
  { pair: 'NZDJPY', baseUnit: 100000, pipDigit: 2 },
]

const accountCurrencies = ['JPY', 'USD', 'EUR', 'GBP', 'AUD']

export default function PipValueCalculator() {
  const [selectedPair, setSelectedPair] = useState('USDJPY')
  const [lotSize, setLotSize] = useState<string>('1')
  const [accountCurrency, setAccountCurrency] = useState('JPY')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculatePipValue = useCallback(() => {
    const lots = parseFloat(lotSize)
    const pair = commonCurrencyPairs.find(p => p.pair === selectedPair)
    
    if (!lots || !pair || lots <= 0) {
      setResult(null)
      return
    }

    // Calculate pip value in base currency
    const pipValue = pair.pipDigit === 2 ? 0.01 : 0.0001
    const pipValueInQuoteCurrency = (lots * pair.baseUnit * pipValue)
    
    // For JPY pairs, pip value is already in JPY
    // For USD pairs, we need to convert
    let pipValueInAccountCurrency = pipValueInQuoteCurrency
    
    if (selectedPair.endsWith('JPY')) {
      // Quote currency is JPY
      if (accountCurrency === 'JPY') {
        pipValueInAccountCurrency = pipValueInQuoteCurrency
      } else {
        // Convert JPY to account currency (simplified - would need real exchange rates)
        pipValueInAccountCurrency = pipValueInQuoteCurrency / 150 // Simplified USD/JPY rate
      }
    } else if (selectedPair.endsWith('USD')) {
      // Quote currency is USD
      if (accountCurrency === 'USD') {
        pipValueInAccountCurrency = pipValueInQuoteCurrency
      } else {
        // Convert USD to account currency (simplified)
        pipValueInAccountCurrency = pipValueInQuoteCurrency * 150 // Simplified for JPY
      }
    }

    setResult({
      pipValueBase: pipValueInQuoteCurrency,
      pipValueAccount: pipValueInAccountCurrency,
      totalValue: pipValueInAccountCurrency
    })
  }, [selectedPair, lotSize, accountCurrency])

  const resetForm = () => {
    setSelectedPair('USDJPY')
    setLotSize('1')
    setAccountCurrency('JPY')
    setResult(null)
  }

  const currentPair = commonCurrencyPairs.find(p => p.pair === selectedPair)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">計算条件を入力</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="currencyPair" className="block text-sm font-medium text-gray-700 mb-2">
                通貨ペア *
              </label>
              <select
                id="currencyPair"
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {commonCurrencyPairs.map((pair) => (
                  <option key={pair.pair} value={pair.pair}>
                    {pair.pair}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-2">
                ロット数 *
              </label>
              <input
                type="number"
                id="lotSize"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 1"
                min="0.01"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                1ロット = 100,000通貨単位
              </p>
            </div>

            <div>
              <label htmlFor="accountCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                口座通貨
              </label>
              <select
                id="accountCurrency"
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {accountCurrencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculatePipValue}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
              >
                計算する
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                リセット
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">計算結果</h3>
          
          {result ? (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-2">1 pip の価値</h4>
                <p className="text-3xl font-bold text-green-700">
                  {accountCurrency === 'JPY' 
                    ? `¥${result.pipValueAccount.toLocaleString()}`
                    : `${result.pipValueAccount.toFixed(2)} ${accountCurrency}`
                  }
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {lotSize} ロット {selectedPair}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">通貨ペア</span>
                  <span className="font-semibold text-gray-900">{selectedPair}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">ロット数</span>
                  <span className="font-semibold text-gray-900">{lotSize}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">取引単位</span>
                  <span className="font-semibold text-gray-900">
                    {(parseFloat(lotSize) * 100000).toLocaleString()} 通貨
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Pipサイズ</span>
                  <span className="font-semibold text-gray-900">
                    {currentPair?.pipDigit === 2 ? '0.01' : '0.0001'}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">📈 損益計算例</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• 10 pips利益: {accountCurrency === 'JPY' 
                    ? `¥${(result.pipValueAccount * 10).toLocaleString()}`
                    : `${(result.pipValueAccount * 10).toFixed(2)} ${accountCurrency}`
                  }</p>
                  <p>• 20 pips損失: {accountCurrency === 'JPY' 
                    ? `-¥${(result.pipValueAccount * 20).toLocaleString()}`
                    : `-${(result.pipValueAccount * 20).toFixed(2)} ${accountCurrency}`
                  }</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💱</div>
              <p className="text-gray-500">
                左側のフォームに値を入力して「計算する」をクリックしてください
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pip価値計算について</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Pipとは？</h5>
            <p>Pipは「Percentage in Point」の略で、通貨ペアの最小価格変動単位です。多くの通貨ペアで0.0001、JPYペアでは0.01が1pipです。</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">なぜ重要？</h5>
            <p>Pip価値を知ることで、取引前に潜在的な損益を計算できます。リスク管理と資金管理の基礎となる重要な概念です。</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">計算式</h5>
            <p>Pip価値 = (Pipサイズ × ロット数 × 通貨単位) ÷ 現在の為替レート</p>
          </div>
        </div>
      </div>
    </div>
  )
}