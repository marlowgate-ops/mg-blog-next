export type CostRow = {
  code: string;
  name: string;
  spread_pips: number;           // 公称スプレッド（USD/JPY等）
  avg_deviation_pips?: number;   // 平均乖離（相場急変時の上乗せ想定）
  swap_long?: number;            // 1lot/日 のスワップ（買い）
  swap_short?: number;           // 1lot/日 のスワップ（売り）
  fee?: number;                  // 片道手数料（円）
};
export const costs: CostRow[] = [
  { code:'dmm',   name:'DMM FX',     spread_pips:0.2, avg_deviation_pips:0.1, swap_long:-50, swap_short:40,  fee:0 },
  { code:'gmo',   name:'GMOクリック', spread_pips:0.2, avg_deviation_pips:0.12, swap_long:-45, swap_short:35, fee:0 },
  { code:'gaitame', name:'外為どっとコム', spread_pips:0.2, avg_deviation_pips:0.15, swap_long:-60, swap_short:48, fee:0 },
  { code:'minna', name:'みんなのFX', spread_pips:0.2, avg_deviation_pips:0.12, swap_long:-42, swap_short:32, fee:0 },
  { code:'sbi',   name:'SBI FX',     spread_pips:0.18, avg_deviation_pips:0.1, swap_long:-55, swap_short:44, fee:0 },
];
// 参考：実質コスト（試算）=> 1lot = 100,000通貨、USD/JPY 1pips ≒ 1,000円 として概算
export function effectiveCostYen(row: CostRow): number {
  const pipsToYen = (p: number)=> p * 1000;
  const spread = pipsToYen(row.spread_pips + (row.avg_deviation_pips ?? 0));
  const fee = row.fee ?? 0;
  // デイリーのスワップは短期トレードを想定し 0 として扱い、別表示で提示
  return Math.max(0, Math.round(spread + fee));
}
