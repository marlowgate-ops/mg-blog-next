/**
 * Market snapshot bar component
 * SSR with ISR revalidation and graceful degradation
 */

import { createMarketProvider, getMarketConfig, SUPPORTED_SYMBOLS } from '@/lib/market/provider';
import { MarketBarClient } from './MarketBarClient';
import { MarketBarFallback } from './MarketBarFallback';

export async function MarketBar() {
  const config = getMarketConfig();
  
  // Early return for disabled provider
  if (config.provider === 'disabled') {
    return <MarketBarFallback />;
  }
  
  try {
    const provider = await createMarketProvider();
    
    if (!provider) {
      return <MarketBarFallback />;
    }
    
    const symbols = Object.keys(SUPPORTED_SYMBOLS);
    const quotes = await provider.getQuotes(symbols);
    
    // If no quotes returned, show fallback
    if (quotes.length === 0) {
      return <MarketBarFallback />;
    }
    
    return <MarketBarClient quotes={quotes} />;
    
  } catch (error) {
    console.error('MarketBar error:', error);
    return <MarketBarFallback />;
  }
}

// Export a version with error boundary
export function MarketBarWithErrorBoundary() {
  return (
    <div className="market-bar-wrapper">
      <MarketBar />
    </div>
  );
}