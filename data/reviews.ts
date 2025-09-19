export type Review = { code:string; rating:number; title:string; body:string; date:string };
export const reviews: Review[] = [
  { code:'dmm', rating:4.6, title:'約定が安定', body:'指標時でも約定が通りやすい印象。アプリの操作感も良い。', date:'2025-09-01' },
  { code:'gmo', rating:4.4, title:'コスト優位', body:'短期のスキャに向く。ツール拡張性も十分。', date:'2025-08-20' },
  { code:'gaitame', rating:4.2, title:'学習に最適', body:'レポートとセミナーが多くて初心者に優しい。', date:'2025-08-10' },
];
