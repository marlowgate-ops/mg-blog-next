export const site = {
  title: 'Marlow Gate',
  description: 'FX・投資・資産運用の実践的ガイド。初心者から上級者まで、効果的な取引戦略、リスク管理、ブローカー比較、最新ニュースまで、投資成功に必要な情報を分かりやすく提供しています。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com',
  author: 'Marlow Gate',
  brand: {
    name: 'Marlow Gate',
    logo: '/og/logo_gate_monogram_dark.png'
  },
  twitter: '@marlowgate'
} as const
