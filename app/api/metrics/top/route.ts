import { NextRequest, NextResponse } from 'next/server';
import { safeKvZrevrange } from '@/lib/kv';
import popularFallback from '@/config/popular.json';

export const runtime = "nodejs";
export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10', 10)));
    
    // Try to get data from KV sorted set
    const kvResults = await safeKvZrevrange('mg:popular:all', 0, limit - 1, true);
    
    if (kvResults && kvResults.length > 0) {
      // Parse KV results - should be [member1, score1, member2, score2, ...]
      const items = [];
      for (let i = 0; i < kvResults.length; i += 2) {
        const path = kvResults[i] as string;
        const score = kvResults[i + 1] as number;
        if (path && score !== undefined) {
          items.push({ path, score });
        }
      }
      
      return NextResponse.json(
        { items },
        {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
          }
        }
      );
    }
    
    // Fallback to config/popular.json
    const fallbackItems = popularFallback.slice(0, limit).map((item, index) => ({
      path: item.url,
      score: popularFallback.length - index // Synthesize decreasing scores
    }));
    
    return NextResponse.json(
      { 
        items: fallbackItems,
        fallback: true 
      },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching top pages:', error);
    
    // Final fallback - always return something
    const limit = 10; // Default limit for fallback
    const fallbackItems = popularFallback.slice(0, limit).map((item, index) => ({
      path: item.url,
      score: popularFallback.length - index
    }));
    
    return NextResponse.json(
      { 
        items: fallbackItems,
        fallback: true,
        error: 'KV unavailable'
      },
      { 
        status: 200, // Don't return error status - graceful degradation
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
        }
      }
    );
  }
}