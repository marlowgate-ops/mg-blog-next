'use client'

import { useState, useCallback, useEffect } from 'react'
import styles from './tools.module.css'

interface CalculationResult {
  positionSize: number
  risk: number
  pipValue: number
}

export default function PositionSizeCalculator() {
  const [balance, setBalance] = useState<string>('1000000')
  const [riskPercent, setRiskPercent] = useState<string>('2')
  const [stopLossPips, setStopLossPips] = useState<string>('20')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculatePosition = useCallback(() => {
    const balanceNum = parseFloat(balance)
    const riskPercentNum = parseFloat(riskPercent)
    const stopLossNum = parseFloat(stopLossPips)

    // Only calculate if all values are valid numbers and positive
    if (isNaN(balanceNum) || isNaN(riskPercentNum) || isNaN(stopLossNum) || 
        balanceNum <= 0 || riskPercentNum <= 0 || stopLossNum <= 0) {
      // Keep existing result or set default fallback
      if (!result) {
        setResult({
          positionSize: 0,
          risk: 0,
          pipValue: 1000
        })
      }
      return
    }

    const riskAmount = (balanceNum * riskPercentNum) / 100
    // Assuming USDJPY as default (1 pip = 0.01 for 1 lot = 100,000 units)
    const pipValue = 1000 // 1 pip = 1000 JPY for 1 lot USDJPY
    const positionSize = riskAmount / (stopLossNum * pipValue)

    setResult({
      positionSize: Math.round(positionSize * 100) / 100,
      risk: riskAmount,
      pipValue: pipValue
    })
  }, [balance, riskPercent, stopLossPips, result])

  // Auto-calculate when inputs change
  useEffect(() => {
    calculatePosition()
  }, [calculatePosition])

  const resetForm = () => {
    setBalance('')
    setRiskPercent('2')
    setStopLossPips('')
    setResult(null)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${styles.toolContainer}`} data-testid="position-calculator">
      <div className={styles.toolGrid}>
        {/* Input Section */}
        <div className={styles.inputSection}>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">計算条件を入力</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
                口座残高 (JPY) *
              </label>
              <input
                type="number"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${styles.inputField}`}
                placeholder="例: 1000000"
                min="0"
                step="1000"
                data-testid="account-balance-input"
              />
            </div>

            <div>
              <label htmlFor="risk" className="block text-sm font-medium text-gray-700 mb-2">
                リスク許容度 (%) *
              </label>
              <input
                type="number"
                id="risk"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 2"
                min="0.1"
                max="10"
                step="0.1"
                data-testid="risk-percentage-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                推奨: 1-3% (初心者は1-2%を推奨)
              </p>
            </div>

            <div>
              <label htmlFor="currencyPair" className="block text-sm font-medium text-gray-700 mb-2">
                通貨ペア *
              </label>
              <select
                id="currencyPair"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="currency-pair-select"
                defaultValue="USDJPY"
              >
                <option value="USDJPY">USD/JPY</option>
                <option value="EURJPY">EUR/JPY</option>
                <option value="GBPJPY">GBP/JPY</option>
                <option value="AUDJPY">AUD/JPY</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
                <option value="AUDUSD">AUD/USD</option>
              </select>
            </div>

            <div>
              <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700 mb-2">
                エントリー価格
              </label>
              <input
                type="number"
                id="entryPrice"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 150.00"
                step="0.01"
                data-testid="entry-price-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                参考価格（計算には影響しません）
              </p>
            </div>

            <div>
              <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700 mb-2">
                ストップロス (pips) *
              </label>
              <input
                type="number"
                id="stopLoss"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 20"
                min="1"
                step="0.1"
                data-testid="stop-loss-input"
              />
              <p className="text-xs text-gray-500 mt-1">
                エントリーポイントからストップロスまでの距離
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={calculatePosition}
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
        <div className={styles.resultSection} data-testid="calculation-results">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">計算結果</h3>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">推奨ポジションサイズ</h4>
              <p className="text-3xl font-bold text-blue-700" data-testid="position-size-result">
                {result ? `${result.positionSize.toFixed(2)} ロット` : '0.00 ロット'}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {result 
                  ? `(標準ロット: ${(result.positionSize * 100000).toLocaleString()} 通貨単位)`
                  : '値を入力して計算してください'
                }
              </p>
            </div>

            {result && (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">最大損失額</span>
                  <span className="font-semibold text-gray-900">
                    ¥{result.risk.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">1 pip価値 (1ロット)</span>
                  <span className="font-semibold text-gray-900">
                    ¥{result.pipValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">実際の1 pip価値</span>
                  <span className="font-semibold text-gray-900">
                    ¥{(result.pipValue * result.positionSize).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h5 className="font-medium text-yellow-800 mb-2">⚠️ 注意事項</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• この計算はUSDJPYを基準としています</li>
                  <li>• 実際の取引前に使用ブローカーの仕様を確認してください</li>
                  <li>• スプレッドや手数料も考慮に入れてください</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">ポジションサイズ計算について</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">なぜ重要？</h5>
            <p>適切なポジションサイズは、一貫したリスク管理の基礎です。感情的な判断を排除し、長期的な収益性向上に繋がります。</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">推奨リスク率</h5>
            <p>初心者: 1-2%、経験者: 2-3%。口座の10%以上のリスクは避け、複数ポジション時は合計リスクを管理しましょう。</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">計算式</h5>
            <p>ポジションサイズ = (口座残高 × リスク%) ÷ (ストップロスpips × 1pip価値)</p>
          </div>
        </div>
      </div>
    </div>
  )
}