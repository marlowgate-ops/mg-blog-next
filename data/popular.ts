export type PopularItem = { rank: number; name: string; code: string; cta: string; url: string; reason: string };
export const popularThisMonth: PopularItem[] = [
  { rank:1, name:'DMM FX', code:'dmm', cta:'公式サイトで口座開設', url:'https://example.com/dmm', reason:'初回入金&取引で特典あり。アプリ体験が高評価。' },
  { rank:2, name:'GMOクリック', code:'gmo', cta:'公式サイトで口座開設', url:'https://example.com/gmo', reason:'スプレッド安定で短期派に人気。' },
  { rank:3, name:'外為どっとコム', code:'gaitame', cta:'公式サイトで口座開設', url:'https://example.com/gaitame', reason:'学習コンテンツが充実、初心者に支持。' },
  { rank:4, name:'みんなのFX', code:'minna', cta:'公式サイトで口座開設', url:'https://example.com/minna', reason:'スワップ重視の中長期派に。' },
  { rank:5, name:'SBI FX', code:'sbi', cta:'公式サイトで口座開設', url:'https://example.com/sbifx', reason:'総合バランス。ツールの拡張性も高い。' },
];
