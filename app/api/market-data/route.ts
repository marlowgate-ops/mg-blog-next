// app/api/market-data/route.ts
import { NextResponse } from 'next/server';
import { getMarketData } from '@/lib/market-data';

export const runtime = 'edge';

// Cache for 120 seconds with 60 seconds stale-while-revalidate
const CACHE_TTL = 120;
const SWR_TTL = 60;

export async function GET() {
  try {
    // Get market data from placeholder function
    const data = await getMarketData();
    
    // Set cache headers for edge caching
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${SWR_TTL}`,
      'CDN-Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${SWR_TTL}`,
      'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${SWR_TTL}`,
    });

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Market data API error:', error);
    
    // Return fallback data with shorter cache time
    const fallbackData = {
      fx: [
        {
          symbol: 'USD/JPY',
          rate: 150.00,
          change: 0.00,
          changePercent: 0.00,
          timestamp: new Date().toISOString(),
        },
        {
          symbol: 'EUR/JPY',
          rate: 162.50,
          change: 0.00,
          changePercent: 0.00,
          timestamp: new Date().toISOString(),
        },
      ],
      indices: [
        {
          symbol: 'N225',
          name: '日経平均株価',
          value: 38500,
          change: 0.00,
          changePercent: 0.00,
          timestamp: new Date().toISOString(),
        },
        {
          symbol: 'TOPIX',
          name: 'TOPIX',
          value: 2650,
          change: 0.00,
          changePercent: 0.00,
          timestamp: new Date().toISOString(),
        },
        {
          symbol: 'SPX',
          name: 'S&P 500',
          value: 5620,
          change: 0.00,
          changePercent: 0.00,
          timestamp: new Date().toISOString(),
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=15',
    });

    return new NextResponse(JSON.stringify(fallbackData), {
      status: 200,
      headers,
    });
  }
}