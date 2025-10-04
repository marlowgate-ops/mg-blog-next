/**
 * Stooq market data provider
 * Free tier with no API key required
 */

import { MarketProvider, MarketSymbol, normalizeSymbol } from '../provider';

export class StooqProvider implements MarketProvider {
  name = 'stooq';
  private baseUrl = 'https://stooq.com/q/l/';

  async getQuotes(symbols: string[]): Promise<MarketSymbol[]> {
    const results: MarketSymbol[] = [];
    
    for (const symbol of symbols) {
      try {
        const normalizedSymbol = normalizeSymbol(symbol);
        const response = await fetch(
          `${this.baseUrl}?s=${normalizedSymbol}&f=sd2t2ohlcv&h&e=csv`,
          { 
            next: { revalidate: 60 },
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; Marlowgate/1.0)'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const csvData = await response.text();
        const lines = csvData.trim().split('\n');
        
        if (lines.length > 1) {
          const data = lines[1].split(',');
          const price = parseFloat(data[4]); // Close price
          const prevClose = parseFloat(data[3]); // Open price as approximation
          const change = price - prevClose;
          const changePercent = (change / prevClose) * 100;
          
          results.push({
            symbol,
            name: this.getSymbolName(symbol),
            price,
            change,
            changePercent,
            currency: this.getSymbolCurrency(symbol),
            lastUpdate: new Date().toISOString()
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch ${symbol} from Stooq:`, error);
        // Continue with other symbols
      }
    }
    
    return results;
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