export type Broker = {
  longReview?: string;
  id: string;
  name: string;
  score: number;
  pros: string[];
  cons: string[];
  subs: { execution: number; app: number; cost: number };
  site?: string;
  state?: "active" | "preparing";
};
export const brokers: Broker[] = [
  {
    id: "dmm",
    name: "DMM.com証券",
    score: 4.4,
    pros: ["国内最大級の利用基盤で情報量が豊富", "約定スピードと配信の安定度に定評", "アプリの操作性と入出金の手軽さ"],
    cons: ["キャンペーン期以外は特典が控えめ", "スワップ・CFDは別口座での補完がおすすめ"],
    subs: { execution: 4.5, app: 4.2, cost: 4.0 ,
      longReview: `国内での知名度・運用基盤が厚く、約定/配信の安定、アプリ/入出金の使いやすさが揃う総合型。最初の1社として安心。`,
  },
    site: process.env.NEXT_PUBLIC_AFF_DMM || "#",
    state: "active",
  },
  {
    id: "matsui",
    name: "松井証券（準備中）",
    score: 0.0,
    pros: ["注文・アプリの刷新を準備中", "主要銀行の即時入金に対応予定"],
    cons: ["正式リリースまでは他口座の併用が無難"],
    subs: { execution: 0, app: 0, cost: 0 ,
      longReview: `刷新準備が進行中。証券基盤の堅牢さに期待。正式化まではサブ口座として温存するのが現実的。`,
  },
    site: "#",
    state: "preparing",
  },
  {
    id: "fxtf",
    name: "ゴールデンウェイ・ジャパン（FXTF）",
    score: 3.6,
    pros: ["スワップとキャンペーンが魅力", "MT4系ツールで細かい設定が可能", "短期売買での約定力に強み"],
    cons: ["変動スプレッドの時間帯がある", "学習コンテンツは大手より少なめ"],
    subs: { execution: 3.6, app: 3.2, cost: 3.5 ,
      longReview: `MT4系ツールの柔軟性と短期の約定力が魅力。時間帯によってスプレッドが広がる点には注意。`,
  },
    site: process.env.NEXT_PUBLIC_AFF_FXTF || "#",
    state: "active",
  },
];

export const LONG_REVIEW: Record<string, string> = {
  dmm: `国内での知名度・運用基盤が厚く、約定と配信の安定度、アプリの使いやすさ、入出金の手軽さが揃う総合型。最初の1社として安心。`,
  matsui: `刷新準備が進行中。証券基盤の堅牢さに期待。正式化まではサブ口座として温存するのが現実的。`,
  fxtf: `MT4系ツールの柔軟性と短期の約定力が魅力。時間帯によってスプレッドが広がる点には注意。`
};
