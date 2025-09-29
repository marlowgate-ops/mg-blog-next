export type Broker = {
  id: string;
  name: string;
  score: number; // 総合 0-5
  pros: string[];
  cons: string[];
  subs: { execution: number; app: number; cost: number };
  site?: string;
  state?: "active" | "preparing";
  product?: string;
  platform?: string;
  costNote?: string;
  minUnit?: string;
  accountFee?: string;
  depositWithdraw?: string;
  api?: string;
  tools?: string;
  appScoreText?: string;
  support?: string;
  note?: string;
  ctaEnv?: string;
};

export const brokers: Broker[] = [
  {
    id: "dmm",
    name: "DMM.com証券",
    score: 4.6,
    pros: ["約定と配信が安定", "アプリが直感的", "入出金が速い"],
    cons: ["日中の一部時間帯でスプレッド拡大あり"],
    subs: { execution: 4.6, app: 4.5, cost: 4.2 },
    site: process.env.NEXT_PUBLIC_AFF_DMM || "#",
    state: "active",
    product: "店頭FX",
    platform: "Web/アプリ",
    costNote: "手数料無料・狭小スプレッド",
    minUnit: "1,000通貨",
    accountFee: "無料",
    depositWithdraw: "クイック入金/即時出金",
    api: "—",
    tools: "プレミアチャート",
    appScoreText: "4.5/5",
    support: "電話/チャット",
  },
  {
    id: "gmo",
    name: "GMOクリック証券",
    score: 4.4,
    pros: ["板/ワンクリ操作が強い", "PCツールが高機能"],
    cons: ["一部通貨で広がりあり"],
    subs: { execution: 4.5, app: 4.2, cost: 4.1 },
    site: process.env.NEXT_PUBLIC_AFF_GMO || "#",
    state: "active",
    product: "店頭FX",
    platform: "PCツール/スマホ",
    costNote: "手数料無料",
    minUnit: "1,000通貨",
    accountFee: "無料",
    depositWithdraw: "クイック入金/即時出金",
    api: "—",
    tools: "はっちゅう君FX/プラチナチャート+",
    appScoreText: "4.3/5",
    support: "電話/メール",
  },
  {
    id: "matsui",
    name: "松井証券",
    score: 3.9,
    pros: ["証券基盤が堅牢"],
    cons: ["UIはシンプル"],
    subs: { execution: 3.8, app: 3.7, cost: 3.8 },
    site: process.env.NEXT_PUBLIC_AFF_MATSUI || "#",
    state: "active",
    product: "店頭FX",
    platform: "Web/アプリ",
    costNote: "手数料無料",
    minUnit: "1,000通貨",
    accountFee: "無料",
    depositWithdraw: "即時入金",
    api: "—",
    tools: "ネットストック",
    appScoreText: "3.8/5",
    support: "電話/メール",
  },
  {
    id: "fxtf",
    name: "FXTF",
    score: 4.0,
    pros: ["MT4が使える", "裁量の拡張性"],
    cons: ["時間帯により拡大あり"],
    subs: { execution: 4.1, app: 3.8, cost: 3.9 },
    site: process.env.NEXT_PUBLIC_AFF_FXTF || "#",
    state: "active",
    product: "店頭FX/CFD",
    platform: "MT4/アプリ",
    costNote: "手数料無料",
    minUnit: "1,000通貨",
    accountFee: "無料",
    depositWithdraw: "即時入金",
    api: "○（MT4）",
    tools: "MT4/EA",
    appScoreText: "3.9/5",
    support: "メール",
  },
];

export const LONG_REVIEW: Record<string, string> = {};
