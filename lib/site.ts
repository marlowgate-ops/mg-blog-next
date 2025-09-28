export const site = {
  title: 'Marlow Gate',
  description: 'FX・投資・資産運用の実践的ガイド',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com',
  author: 'Marlow Gate',
  brand: {
    name: 'Marlow Gate',
    logo: '/og/logo_gate_monogram_dark.png'
  },
  twitter: '@marlowgate'
} as const
