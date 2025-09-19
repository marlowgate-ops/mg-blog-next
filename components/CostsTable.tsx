'use client'
import { costs, effectiveCostYen } from '@/data/costs'
export default function CostsTable(){
  return (
    <div className="costs">
      <div className="wrap" role="region" aria-label="実質コスト比較">
        <table>
          <thead><tr><th>会社</th><th>公称スプレッド</th><th>平均乖離</th><th>手数料</th><th>実質コスト</th><th>スワップ(買/売)</th></tr></thead>
          <tbody>
            {costs.map(r => (
              <tr key={r.code}>
                <td>{r.name}</td>
                <td>{r.spread_pips} pips</td>
                <td>{r.avg_deviation_pips ?? 0} pips</td>
                <td>¥{(r.fee ?? 0).toLocaleString()}</td>
                <td><strong>¥{effectiveCostYen(r).toLocaleString()}</strong></td>
                <td>{r.swap_long ?? 0} / {r.swap_short ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <div className="src">※出典/算出: 編集部集計（公称スプレッド/手数料の公開値＋相場急変時の平均乖離を仮置き）。参考値であり約定を保証しません。</div>
      <style jsx>{`
        .wrap{overflow:auto;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
        table{width:100%;border-collapse:separate;border-spacing:0}
        th,td{padding:10px 12px;border-bottom:1px solid #eef2f7;text-align:left;white-space:nowrap}
        thead th{background:#f8fafc;font-weight:700}
      .src{color:#64748b;font-size:12px;margin-top:8px}`}</style>
    </div>
  )
}
