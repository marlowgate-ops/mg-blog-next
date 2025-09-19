export type CostRow = { code:string; name:string; spread_pips:number; avg_deviation_pips?:number; swap_long?:number; swap_short?:number; fee?:number };
export const costs: CostRow[] = [
  { code:'dmm', name:'DMM FX', spread_pips:0.2, avg_deviation_pips:0.1, swap_long:-50, swap_short:40, fee:0 },
  { code:'gmo', name:'GMOクリック', spread_pips:0.2, avg_deviation_pips:0.12, swap_long:-45, swap_short:35, fee:0 },
  { code:'gaitame', name:'外為どっとコム', spread_pips:0.2, avg_deviation_pips:0.15, swap_long:-60, swap_short:48, fee:0 },
];
export function effectiveCostYen(row: CostRow){ const pipsToYen=(p:number)=>p*1000; const spread=pipsToYen(row.spread_pips+(row.avg_deviation_pips??0)); const fee=row.fee??0; return Math.max(0, Math.round(spread+fee)); }
