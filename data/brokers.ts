export type BrokerStatus = "active" | "preparing";
export type Broker = {
  id: string;
  name: string;
  status: BrokerStatus;
  score: number; // 0-5
  pros: string[];
  cons: string[];
  ctaEnv?: string; // env var name for aff link
  site?: string; // fallback public url
  notes?: string;
  highlights?: string[];
};

// NOTE: CTA URLは環境変数から取得。ASPパラメータ破損を避けるため自動UTM付与はしません。
export const brokers: Broker[] = [
  {
    id: "dmm",
    name: "DMM.com証券",
    status: "active",
    score: 4.4,
    pros: ["国内大手で情報量が豊富", "約定スピードに定評"],
    cons: ["キャンペーン期以外は条件が平凡"],
    ctaEnv: "NEXT_PUBLIC_AFF_DMM",
    site: "https://securities.dmm.com/",
    highlights: ["国内サポート", "初心者向けUI"]
  },
  {
    id: "matsui",
    name: "松井証券（準備中）",
    status: "preparing",
    score: 0.0,
    pros: ["準備中"],
    cons: ["準備中"],
    site: "https://www.matsui.co.jp/"
  },
  {
    id: "fxtf",
    name: "ゴールデンウェイ・ジャパン（FXTF）",
    status: "active",
    score: 3.6,
    pros: ["スワップ・キャンペーン", "ECNに近い設計"],
    cons: ["アプリ改善中", "情報量は大手に劣る"],
    ctaEnv: "NEXT_PUBLIC_AFF_FXTF",
    site: "https://www.gaitamefinest.com/",
    highlights: ["FXTFならではの高機能ツール"]
  }
];
