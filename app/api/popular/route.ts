import { NextRequest, NextResponse } from 'next/server';
import { getTop, PopularRange, PopularKind } from '@/lib/metrics/popular';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const range = (searchParams.get('range') || 'week') as PopularRange;
  const kind = (searchParams.get('kind') || 'all') as PopularKind;
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const items = await getTop(kind, range, limit);
    
    const response = NextResponse.json({
      items,
      range,
      kind,
      timestamp: new Date().toISOString()
    });
    
    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
    
  } catch (error) {
    console.error('Popular API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch popular items',
        items: []
      },
      { status: 500 }
    );
  }
}