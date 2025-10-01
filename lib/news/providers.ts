import { NewsProvider } from './types';

// News Provider Registry
export const providers: NewsProvider[] = [
  {
    id: 'reuters',
    name: 'Reuters',
    displayName: 'Reuters',
    description: '世界最大の国際通信社による金融・経済ニュース',
    icon: '/icons/providers/reuters.svg',
    website: 'https://www.reuters.com',
    category: 'financial',
    categories: ['market', 'economy', 'policy', 'global'],
    country: 'GLOBAL',
    languages: ['en', 'ja'],
    established: '1851',
    establishedYear: 1851,
    credibility: 'high',
    credibilityScore: 5,
    updateFrequency: 'realtime',
    featured: true
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    displayName: 'Bloomberg',
    description: '金融情報サービス大手による市場ニュースと分析',
    icon: '/icons/providers/bloomberg.svg',
    website: 'https://www.bloomberg.com',
    category: 'financial',
    country: 'US',
    languages: ['en', 'ja'],
    established: '1981',
    credibility: 'high',
    updateFrequency: 'realtime',
    featured: true
  },
  {
    id: 'nikkei',
    name: 'Nikkei',
    displayName: '日本経済新聞',
    description: '日本最大の経済専門紙による国内外の経済・金融ニュース',
    icon: '/icons/providers/nikkei.svg',
    website: 'https://www.nikkei.com',
    category: 'economic',
    country: 'JP',
    languages: ['ja'],
    established: '1876',
    credibility: 'high',
    updateFrequency: 'hourly',
    featured: true
  },
  {
    id: 'marketwatch',
    name: 'MarketWatch',
    displayName: 'MarketWatch',
    description: 'Dow Jones傘下の金融市場ニュースサイト',
    icon: '/icons/providers/marketwatch.svg',
    website: 'https://www.marketwatch.com',
    category: 'financial',
    country: 'US',
    languages: ['en'],
    established: '1997',
    credibility: 'high',
    updateFrequency: 'realtime',
    featured: true
  },
  {
    id: 'cnbc',
    name: 'CNBC',
    displayName: 'CNBC',
    description: 'ビジネス・金融専門チャンネルによるニュース',
    icon: '/icons/providers/cnbc.svg',
    website: 'https://www.cnbc.com',
    category: 'financial',
    country: 'US',
    languages: ['en'],
    established: '1989',
    credibility: 'high',
    updateFrequency: 'realtime',
    featured: true
  },
  {
    id: 'financial-times',
    name: 'Financial Times',
    displayName: 'Financial Times',
    description: '英国発の世界的経済紙',
    icon: '/icons/providers/ft.svg',
    website: 'https://www.ft.com',
    category: 'financial',
    country: 'GB',
    languages: ['en'],
    established: '1888',
    credibility: 'high',
    updateFrequency: 'hourly',
    featured: true
  },
  {
    id: 'wsj',
    name: 'Wall Street Journal',
    displayName: 'Wall Street Journal',
    description: 'Dow Jones発行の世界的経済紙',
    icon: '/icons/providers/wsj.svg',
    website: 'https://www.wsj.com',
    category: 'financial',
    country: 'US',
    languages: ['en'],
    established: '1889',
    credibility: 'high',
    updateFrequency: 'hourly',
    featured: true
  },
  {
    id: 'coindesk',
    name: 'CoinDesk',
    displayName: 'CoinDesk',
    description: '暗号資産・ブロックチェーン専門メディア',
    icon: '/icons/providers/coindesk.svg',
    website: 'https://www.coindesk.com',
    category: 'crypto',
    country: 'US',
    languages: ['en'],
    established: '2013',
    credibility: 'high',
    updateFrequency: 'realtime',
    featured: false
  },
  {
    id: 'cointelegraph',
    name: 'Cointelegraph',
    displayName: 'Cointelegraph',
    description: '暗号資産・フィンテック専門ニュース',
    icon: '/icons/providers/cointelegraph.svg',
    website: 'https://cointelegraph.com',
    category: 'crypto',
    country: 'GLOBAL',
    languages: ['en', 'ja'],
    established: '2013',
    credibility: 'medium',
    updateFrequency: 'hourly',
    featured: false
  },
  {
    id: 'yahoo-finance',
    name: 'Yahoo Finance',
    displayName: 'Yahoo Finance',
    description: 'Yahoo提供の金融・投資情報サービス',
    icon: '/icons/providers/yahoo.svg',
    website: 'https://finance.yahoo.com',
    category: 'financial',
    country: 'US',
    languages: ['en', 'ja'],
    established: '1997',
    credibility: 'medium',
    updateFrequency: 'hourly',
    featured: false
  }
];

// Utility functions
export function getProviderById(id: string): NewsProvider | undefined {
  return providers.find(provider => provider.id === id);
}

export function getProvidersByCategory(category: NewsProvider['category']): NewsProvider[] {
  return providers.filter(provider => provider.category === category);
}

export function getFeaturedProviders(): NewsProvider[] {
  return providers.filter(provider => provider.featured);
}

export function getProvidersByCountry(country: NewsProvider['country']): NewsProvider[] {
  return providers.filter(provider => provider.country === country);
}

export function getProviderCategories(): NewsProvider['category'][] {
  return Array.from(new Set(providers.map(p => p.category)));
}

export function getProviderStats() {
  const total = providers.length;
  const byCategory = getProviderCategories().reduce((acc, category) => {
    acc[category] = getProvidersByCategory(category).length;
    return acc;
  }, {} as Record<NewsProvider['category'], number>);
  
  const byCountry = ['JP', 'US', 'GB', 'GLOBAL'].reduce((acc, country) => {
    acc[country] = getProvidersByCountry(country as NewsProvider['country']).length;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    featured: getFeaturedProviders().length,
    byCategory,
    byCountry
  };
}