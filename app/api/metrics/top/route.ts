import { NextRequest, NextResponse } from 'next/server';
import popularItemsData from '@/config/popular.json';

export const runtime = "nodejs";

interface PopularItem {
  id: string;
  title: string;
  url: string;
  views: number;
}

interface TopPageData {
  pathname: string;
  views: number;
  title?: string;
  lastViewed: string;
}

// Check if Vercel KV is available
const hasVercelKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function getTopPages(days: number = 7, limit: number = 10): Promise<TopPageData[]> {
  if (hasVercelKV) {
    try {
      // In a real implementation, you would query KV for view data
      // For now, return mock data with the popular items
      const popular = popularItemsData as PopularItem[];
      return popular.slice(0, limit).map(item => ({
        pathname: new URL(item.url).pathname,
        views: item.views,
        title: item.title,
        lastViewed: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Vercel KV error:', error);
    }
  }
  
  // Fallback to static popular items
  const popular = popularItemsData as PopularItem[];
  return popular.slice(0, limit).map(item => ({
    pathname: new URL(item.url).pathname,
    views: item.views,
    title: item.title,
    lastViewed: new Date().toISOString()
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Math.max(1, Math.min(30, parseInt(searchParams.get('days') || '7', 10)));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10', 10)));
    
    const topPages = await getTopPages(days, limit);
    
    return NextResponse.json({
      pages: topPages,
      period: {
        days,
        limit
      },
      generatedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error fetching top pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top pages' },
      { status: 500 }
    );
  }
}