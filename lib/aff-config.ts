// Centralized affiliate URLs (env-driven).
// Fallbacks point to official pages so UXは壊れない（報酬は発生しません）。
export const AFF = {
  OANDA: process.env.NEXT_PUBLIC_AFF_OANDA ?? 'https://www.oanda.jp/',
  XM: process.env.NEXT_PUBLIC_AFF_XM ?? 'https://www.xmtrading.com/jp/',
  TITAN: process.env.NEXT_PUBLIC_AFF_TITAN ?? 'https://titanfx.com/jp',
  DMM: process.env.NEXT_PUBLIC_AFF_DMM ?? 'https://fx.dmm.com/',
  MATSUI: process.env.NEXT_PUBLIC_AFF_MATSUI ?? 'https://www.matsui.co.jp/',
} as const
