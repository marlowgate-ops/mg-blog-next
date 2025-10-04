import { NextResponse } from 'next/server';
import { createMarketProvider, SUPPORTED_SYMBOLS } from '@/lib/market/provider';

export const runtime = 'edge';

export async function GET() {
  try {
    const provider = await createMarketProvider();
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Market provider disabled', quotes: [] },
        { status: 200 }
      );
    }
    
    const symbols = Object.keys(SUPPORTED_SYMBOLS);
    const quotes = await provider.getQuotes(symbols);
    
    const response = NextResponse.json({
      provider: provider.name,
      quotes,
      timestamp: new Date().toISOString()
    });
    
    // Set cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
    
  } catch (error) {
    console.error('Market data API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch market data',
        quotes: []
      },
      { status: 500 }
    );
  }
}