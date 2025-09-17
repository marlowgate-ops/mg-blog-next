export type Broker = {
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
    pros: ["国内大手で情報量が豊富", "約定スピードに定評"],
    cons: ["キャンペーン期以外は条件が平凡"],
    subs: { execution: 4.5, app: 4.2, cost: 4.0 },
    site: process.env.NEXT_PUBLIC_AFF_DMM || "#",
    state: "active",
  },
  {
    id: "matsui",
    name: "松井証券（準備中）",
    score: 0.0,
    pros: ["準備中"],
    cons: [],
    subs: { execution: 0, app: 0, cost: 0 },
    site: "#",
    state: "preparing",
  },
  {
    id: "fxtf",
    name: "ゴールデンウェイ・ジャパン（FXTF）",
    score: 3.6,
    pros: ["スワップ・キャンペーン", "一部に定評"],
    cons: ["ECNに近い設計", "情報量は大手に劣る"],
    subs: { execution: 3.6, app: 3.2, cost: 3.5 },
    site: process.env.NEXT_PUBLIC_AFF_FXTF || "#",
    state: "active",
  },
];
