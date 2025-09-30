// lib/market-data.ts - Placeholder functions for market data
export interface FxData {
  symbol: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface MarketData {
  fx: FxData[];
  indices: IndexData[];
  lastUpdated: string;
}

// Placeholder function - simulate market data with realistic values
export async function getMarketData(): Promise<MarketData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  const now = new Date().toISOString();
  
  // Generate realistic FX data with small random variations
  const baseRates = { 'USD/JPY': 150.25, 'EUR/JPY': 162.80 };
  const fx: FxData[] = Object.entries(baseRates).map(([symbol, baseRate]) => {
    const variation = (Math.random() - 0.5) * 2; // ±1 range
    const rate = Number((baseRate + variation).toFixed(2));
    const change = Number((Math.random() - 0.5).toFixed(2));
    const changePercent = Number(((change / rate) * 100).toFixed(2));
    
    return {
      symbol,
      rate,
      change,
      changePercent,
      timestamp: now,
    };
  });
  
  // Generate realistic index data
  const baseIndices = {
    'N225': { name: '日経平均株価', value: 38500 },
    'TOPIX': { name: 'TOPIX', value: 2650 },
    'SPX': { name: 'S&P 500', value: 5620 },
  };
  
  const indices: IndexData[] = Object.entries(baseIndices).map(([symbol, { name, value: baseValue }]) => {
    const variation = (Math.random() - 0.5) * (baseValue * 0.02); // ±2% variation
    const value = Number((baseValue + variation).toFixed(2));
    const change = Number((Math.random() - 0.5 * baseValue * 0.01).toFixed(2));
    const changePercent = Number(((change / value) * 100).toFixed(2));
    
    return {
      symbol,
      name,
      value,
      change,
      changePercent,
      timestamp: now,
    };
  });
  
  return {
    fx,
    indices,
    lastUpdated: now,
  };
}

// Mock error for testing fallbacks
export async function getMarketDataWithError(): Promise<MarketData> {
  if (Math.random() < 0.1) { // 10% chance of error for testing
    throw new Error('Market data service unavailable');
  }
  return getMarketData();
}