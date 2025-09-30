import s from './SpreadsTable.module.css';

interface SpreadsTableProps {
  spreads: {
    majorPairs: Record<string, number>;
  };
  feesNote: string;
}

export default function SpreadsTable({ spreads, feesNote }: SpreadsTableProps) {
  const formatPair = (pair: string): string => {
    const pairMap: Record<string, string> = {
      'USDJPY': 'USD/JPY',
      'EURUSD': 'EUR/USD',
      'GBPUSD': 'GBP/USD',
      'AUDUSD': 'AUD/USD',
      'EURJPY': 'EUR/JPY',
      'GBPJPY': 'GBP/JPY',
      'AUDJPY': 'AUD/JPY',
      'NZDUSD': 'NZD/USD',
      'USDCHF': 'USD/CHF',
      'USDCAD': 'USD/CAD'
    };
    return pairMap[pair] || pair;
  };

  const formatSpread = (spread: number, pair: string): string => {
    // JPY pairs use pips (銭), others use pips
    const isJpyPair = pair.includes('JPY');
    const unit = isJpyPair ? '銭' : 'pips';
    return `${spread}${unit}`;
  };

  const getSpreadClass = (spread: number): string => {
    if (spread <= 0.3) return 'excellent';
    if (spread <= 0.7) return 'good';
    if (spread <= 1.0) return 'fair';
    return 'poor';
  };

  return (
    <div className={s.spreadsTable}>
      <h2 className={s.title}>スプレッド・手数料</h2>
      
      <div className={s.tableContainer}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.header}>通貨ペア</th>
              <th className={s.header}>スプレッド</th>
              <th className={s.header}>評価</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(spreads.majorPairs).map(([pair, spread]) => (
              <tr key={pair} className={s.row}>
                <td className={s.pair}>{formatPair(pair)}</td>
                <td className={s.spread}>
                  <span className={`${s.spreadValue} ${s[getSpreadClass(spread)]}`}>
                    {formatSpread(spread, pair)}
                  </span>
                </td>
                <td className={s.rating}>
                  <span className={`${s.ratingBadge} ${s[getSpreadClass(spread)]}`}>
                    {getSpreadClass(spread) === 'excellent' && '★★★'}
                    {getSpreadClass(spread) === 'good' && '★★☆'}
                    {getSpreadClass(spread) === 'fair' && '★☆☆'}
                    {getSpreadClass(spread) === 'poor' && '☆☆☆'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.feesNote}>
        <h3 className={s.feesTitle}>手数料について</h3>
        <p className={s.feesText}>{feesNote}</p>
      </div>

      <div className={s.disclaimer}>
        <p className={s.disclaimerText}>
          ※ スプレッドは原則固定ですが、市場の急変時（重要な経済指標の発表前後、流動性の低下時など）は変動する場合があります。
          最新のスプレッド情報は各社の公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}