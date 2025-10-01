'use client'

import { useState, useCallback } from 'react'

interface CalculationResult {
  marginRequired: number
  marginPercent: number
  freeMargin: number
  maxLots: number
}

const commonCurrencyPairs = [
  { pair: 'USDJPY', rate: 150 },
  { pair: 'EURUSD', rate: 1.08 },
  { pair: 'GBPJPY', rate: 185 },
  { pair: 'AUDJPY', rate: 95 },
  { pair: 'EURJPY', rate: 162 },
  { pair: 'GBPUSD', rate: 1.25 },
  { pair: 'AUDUSD', rate: 0.65 },
  { pair: 'NZDJPY', rate: 88 },
]

const leverageOptions = [25, 50, 100, 200, 400, 500, 888, 1000]

export default function MarginCalculator() {
  const [selectedPair, setSelectedPair] = useState('USDJPY')
  const [lotSize, setLotSize] = useState<string>('1')
  const [leverage, setLeverage] = useState(25)
  const [accountBalance, setAccountBalance] = useState<string>('')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculateMargin = useCallback(() => {
    const lots = parseFloat(lotSize)
    const balance = parseFloat(accountBalance)
    const pair = commonCurrencyPairs.find(p => p.pair === selectedPair)
    
    if (!lots || !balance || !pair || lots <= 0 || balance <= 0) {
      setResult(null)
      return
    }

    // Calculate contract size in JPY
    const contractSize = lots * 100000 // Standard lot size
    let contractValueJPY: number

    if (selectedPair.endsWith('JPY')) {
      // For XXX/JPY pairs, multiply by current rate
      contractValueJPY = contractSize * pair.rate
    } else {
      // For XXX/USD pairs, convert to JPY (USD/JPY rate assumed 150)
      contractValueJPY = contractSize * pair.rate * 150
    }

    // Calculate required margin
    const marginRequired = contractValueJPY / leverage
    const marginPercent = (marginRequired / balance) * 100
    const freeMargin = Math.max(0, balance - marginRequired)
    const maxLots = (balance * leverage) / (pair.rate * 100000 * (selectedPair.endsWith('JPY') ? 1 : 150))

    setResult({
      marginRequired,
      marginPercent,
      freeMargin,
      maxLots
    })
  }, [selectedPair, lotSize, leverage, accountBalance])

  const resetForm = () => {
    setSelectedPair('USDJPY')
    setLotSize('1')
    setLeverage(25)
    setAccountBalance('')
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
                    {pair.pair} ({pair.rate})
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
              <label htmlFor="leverage" className="block text-sm font-medium text-gray-700 mb-2">
                レバレッジ *
              </label>
              <select
                id="leverage"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {leverageOptions.map((lev) => (
                  <option key={lev} value={lev}>
                    {lev}倍
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                日本国内は最大25倍、海外口座はより高いレバレッジも可能
              </p>
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
                口座残高 (JPY)
              </label>
              <input
                type="number"
                id="balance"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 1000000"
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                余力計算のため（オプション）
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculateMargin}
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
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-2">必要証拠金</h4>
                <p className="text-3xl font-bold text-purple-700">
                  ¥{result.marginRequired.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  {lotSize} ロット {selectedPair} (レバレッジ {leverage}倍)
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">取引価値</span>
                  <span className="font-semibold text-gray-900">
                    ¥{((parseFloat(lotSize) * 100000 * (currentPair?.rate || 0) * (selectedPair.endsWith('JPY') ? 1 : 150))).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">レバレッジ</span>
                  <span className="font-semibold text-gray-900">{leverage}倍</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">証拠金率</span>
                  <span className="font-semibold text-gray-900">
                    {(100 / leverage).toFixed(2)}%
                  </span>
                </div>

                {accountBalance && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">証拠金使用率</span>
                      <span className={`font-semibold ${
                        result.marginPercent > 80 ? 'text-red-600' : 
                        result.marginPercent > 50 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {result.marginPercent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">余力</span>
                      <span className="font-semibold text-gray-900">
                        ¥{result.freeMargin.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">最大可能ロット</span>
                      <span className="font-semibold text-gray-900">
                        {result.maxLots.toFixed(2)} ロット
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className={`rounded-lg p-4 border ${
                result.marginPercent > 80 ? 'bg-red-50 border-red-200' :
                result.marginPercent > 50 ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <h5 className={`font-medium mb-2 ${
                  result.marginPercent > 80 ? 'text-red-800' :
                  result.marginPercent > 50 ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {result.marginPercent > 80 ? '⚠️ 高リスク' :
                   result.marginPercent > 50 ? '⚡ 中リスク' :
                   '✅ 安全範囲'}
                </h5>
                <div className={`text-sm space-y-1 ${
                  result.marginPercent > 80 ? 'text-red-700' :
                  result.marginPercent > 50 ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {result.marginPercent > 80 ? (
                    <>
                      <p>• 証拠金使用率が80%を超えています</p>
                      <p>• マージンコールのリスクが高いです</p>
                      <p>• ポジションサイズの縮小を検討してください</p>
                    </>
                  ) : result.marginPercent > 50 ? (
                    <>
                      <p>• 証拠金使用率がやや高めです</p>
                      <p>• 追加ポジションは慎重に検討してください</p>
                      <p>• リスク管理を徹底してください</p>
                    </>
                  ) : (
                    <>
                      <p>• 証拠金使用率は安全範囲内です</p>
                      <p>• 追加ポジションの余力があります</p>
                      <p>• 適切なリスク管理を継続してください</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏦</div>
              <p className="text-gray-500">
                左側のフォームに値を入力して「計算する」をクリックしてください
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">証拠金計算について</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">証拠金とは？</h5>
            <p>FX取引において、ポジションを保持するために必要な担保金です。レバレッジにより、実際の取引額より少ない資金で取引が可能になります。</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">マージンコール</h5>
            <p>証拠金維持率が一定水準を下回ると、追加入金やポジション決済を求められます。多くのブローカーで100%または50%がライン。</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">計算式</h5>
            <p>必要証拠金 = 取引通貨量 × 現在価格 ÷ レバレッジ</p>
          </div>
        </div>
      </div>
    </div>
  )
}