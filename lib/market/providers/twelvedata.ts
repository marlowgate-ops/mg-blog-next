/**
 * TwelveData market data provider
 * Requires API key but provides real-time data
 */

import { MarketProvider, MarketSymbol } from '../provider';

export class TwelveDataProvider implements MarketProvider {
  name = 'twelvedata';
  private baseUrl = 'https://api.twelvedata.com';

  constructor(private apiKey: string) {}

  async getQuotes(symbols: string[]): Promise<MarketSymbol[]> {
    const results: MarketSymbol[] = [];
    
    try {
      const symbolString = symbols.join(',');
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbolString}&apikey=${this.apiKey}`,
        { 
          next: { revalidate: 60 },
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle single symbol response
      if (!Array.isArray(data)) {
        const quote = this.parseQuote(symbols[0], data);
        if (quote) results.push(quote);
        return results;
      }
      
      // Handle multiple symbols response
      for (const [symbol, quoteData] of Object.entries(data)) {
        const quote = this.parseQuote(symbol, quoteData as any);
        if (quote) results.push(quote);
      }
      
    } catch (error) {
      console.warn('Failed to fetch quotes from TwelveData:', error);
    }
    
    return results;
  }
  
  private parseQuote(symbol: string, data: any): MarketSymbol | null {
    try {
      const price = parseFloat(data.close);
      const prevClose = parseFloat(data.previous_close);
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;
      
      return {
        symbol,
        name: this.getSymbolName(symbol),
        price,
        change,
        changePercent,
        currency: this.getSymbolCurrency(symbol),
        lastUpdate: data.datetime || new Date().toISOString()
      };
    } catch (error) {
      console.warn(`Failed to parse quote for ${symbol}:`, error);
      return null;
    }
  }
  
  private getSymbolName(symbol: string): string {
    const symbolMap: Record<string, string> = {
      'USDJPY': 'USD/JPY',
      '^N225': 'Nikkei 225',
      'BTCUSD': 'Bitcoin'
    };
    return symbolMap[symbol] || symbol;
  }
  
  private getSymbolCurrency(symbol: string): string {
    const currencyMap: Record<string, string> = {
      'USDJPY': 'JPY',
      '^N225': 'JPY', 
      'BTCUSD': 'USD'
    };
    return currencyMap[symbol] || 'USD';
  }
}