import { NextRequest, NextResponse } from 'next/server';
import { getRankingData, getPopularContent, trackGA4Event } from '@/lib/rankings/data';
import { RankingWindow, RankingType } from '@/lib/rankings/types';

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes
export const dynamic = 'force-dynamic';

// GET /api/rankings - Retrieve ranking data with caching
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const window = (searchParams.get('window') as RankingWindow) || '24h';
    const type = (searchParams.get('type') as RankingType) || 'all';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Validate parameters
    if (!['24h', '7d'].includes(window)) {
      return NextResponse.json(
        { error: 'Invalid window parameter. Must be 24h or 7d' },
        { status: 400 }
      );
    }
    
    if (!['news', 'brokers', 'insurance', 'posts', 'tools', 'tags', 'all'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      );
    }
    
    let data;
    
    if (type === 'all') {
      // Return all categories
      data = await getPopularContent(window);
    } else {
      // Return specific category
      data = await getRankingData(type, window, limit);
      
      // Apply offset if specified
      if (offset > 0) {
        data.items = data.items.slice(offset);
      }
    }
    
    const response = NextResponse.json({
      success: true,
      data,
      meta: {
        window,
        type,
        limit,
        offset,
        generatedAt: new Date().toISOString()
      }
    });
    
    // Set cache headers for SWR
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
    
    return response;
    
  } catch (error) {
    console.error('Rankings API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/rankings - Track GA4 events for ranking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.event_name || !body.event_parameters) {
      return NextResponse.json(
        { error: 'Missing required fields: event_name, event_parameters' },
        { status: 400 }
      );
    }
    
    const { event_name, event_parameters } = body;
    
    // Validate event name
    const validEvents = [
      'news_link_click',
      'broker_outbound_click', 
      'insurance_outbound_click',
      'tool_calc_use',
      'post_view'
    ];
    
    if (!validEvents.includes(event_name)) {
      return NextResponse.json(
        { error: `Invalid event_name. Must be one of: ${validEvents.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate event parameters
    if (!event_parameters.item_id || !event_parameters.item_name) {
      return NextResponse.json(
        { error: 'Missing required event_parameters: item_id, item_name' },
        { status: 400 }
      );
    }
    
    // Add timestamp if not provided
    if (!event_parameters.timestamp) {
      event_parameters.timestamp = Date.now();
    }
    
    // Track the event
    await trackGA4Event({
      event_name,
      event_parameters
    });
    
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      event: {
        name: event_name,
        item_id: event_parameters.item_id,
        timestamp: event_parameters.timestamp
      }
    });
    
  } catch (error) {
    console.error('Rankings tracking error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to track event',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}