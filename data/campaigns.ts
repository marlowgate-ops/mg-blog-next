export type Campaign = { name:string; code:string; max:number; until:string; condition:string; url:string };
export const campaigns: Campaign[] = [
  { name:'DMM FX 新規口座開設', code:'dmm', max:30000, until:'2025-10-31', condition:'新規口座＋一定Lot取引', url:'https://example.com/dmm/cp' },
  { name:'GMOクリック 秋の還元', code:'gmo', max:20000, until:'2025-10-15', condition:'期間内の新規/取引量条件', url:'https://example.com/gmo/cp' },
  { name:'外為どっとコム スタート応援', code:'gaitame', max:15000, until:'2025-11-30', condition:'新規＋初回入金', url:'https://example.com/gaitame/cp' },
];
