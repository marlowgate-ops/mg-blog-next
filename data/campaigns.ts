export type Campaign = {
  id: string;
  brand: string;
  maxAmountYen: number; // 最大受取額(円)
  deadline?: string | null; // ISO8601 or null=未定/常設
  condition: string; // 例: 新規/○Lot以上など
  notes?: string;
  url: string; // 公式リンク
  active: boolean; // 受付中か
};

export const campaigns: Campaign[] = [
  { id: "dmmfx-autumn", brand: "DMM FX", maxAmountYen: 300000, deadline: null, condition: "新規+取引数量条件", notes: "達成で最大30万円。詳細は公式条件を確認。", url: "https://px.a8.net/...", active: true },
  { id: "gmo-click", brand: "GMOクリック証券", maxAmountYen: 200000, deadline: null, condition: "新規+取引数量条件", notes: "", url: "https://px.a8.net/...", active: true },
  { id: "smbc", brand: "SMBC日興", maxAmountYen: 100000, deadline: null, condition: "新規+資金条件", notes: "", url: "https://px.a8.net/...", active: true },
  { id: "rakuten", brand: "楽天証券", maxAmountYen: 100000, deadline: null, condition: "新規+取引数量条件", notes: "", url: "https://px.a8.net/...", active: true },
  { id: "au-kabu", brand: "auカブコム", maxAmountYen: 80000, deadline: null, condition: "新規+取引数量条件", notes: "", url: "https://px.a8.net/...", active: true },
  { id: "other", brand: "その他", maxAmountYen: 30000, deadline: null, condition: "新規", notes: "", url: "#", active: false },
];
