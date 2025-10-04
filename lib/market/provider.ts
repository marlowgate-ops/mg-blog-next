/**
 * Market data provider interface and factory
 * Supports pluggable providers with graceful degradation
 */

export interface MarketSymbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdate: string;
}

export interface MarketProvider {
  name: string;
  getQuotes(symbols: string[]): Promise<MarketSymbol[]>;
}

export interface MarketConfig {
  provider: 'stooq' | 'twelvedata' | 'disabled';
  pollSeconds: number;
  apiKey?: string;
}

export const SUPPORTED_SYMBOLS = {
  'USDJPY': { name: 'USD/JPY', currency: 'JPY' },
  '^N225': { name: 'Nikkei 225', currency: 'JPY' },
  'BTCUSD': { name: 'Bitcoin', currency: 'USD' }
} as const;

export function getMarketConfig(): MarketConfig {
  return {
    provider: (process.env.MARKET_PROVIDER as any) || 'disabled',
    pollSeconds: parseInt(process.env.MARKET_POLL_SECONDS || '60'),
    apiKey: process.env.TWELVEDATA_API_KEY
  };
}

export async function createMarketProvider(): Promise<MarketProvider | null> {
  const config = getMarketConfig();
  
  if (config.provider === 'disabled') {
    return null;
  }
  
  try {
    switch (config.provider) {
      case 'stooq':
        const { StooqProvider } = await import('./providers/stooq');
        return new StooqProvider();
      case 'twelvedata':
        if (!config.apiKey) {
          console.warn('TWELVEDATA_API_KEY not provided, falling back to disabled');
          return null;
        }
        const { TwelveDataProvider } = await import('./providers/twelvedata');
        return new TwelveDataProvider(config.apiKey);
      default:
        console.warn(`Unknown market provider: ${config.provider}, falling back to disabled`);
        return null;
    }
  } catch (error) {
    console.error('Failed to create market provider:', error);
    return null;
  }
}

export function normalizeSymbol(symbol: string): string {
  // Normalize symbol formats across providers
  switch (symbol) {
    case '^N225':
      return 'NKY'; // Common format for Nikkei
    case 'BTCUSD':
      return 'BTC/USD';
    default:
      return symbol;
  }
}