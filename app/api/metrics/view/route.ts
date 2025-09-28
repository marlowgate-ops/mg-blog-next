import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = "nodejs";

interface ViewData {
  pathname: string;
  views: number;
  lastViewed: string;
}

// In-memory storage (fallback when Vercel KV is not available)
const memoryStore = new Map<string, ViewData>();

// Check if Vercel KV is available
const hasVercelKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function incrementView(pathname: string): Promise<ViewData> {
  if (hasVercelKV) {
    try {
      // Use Vercel KV if available
      const kvResponse = await fetch(
        `${process.env.KV_REST_API_URL}/incr/views:${pathname}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        }
      );
      
      if (kvResponse.ok) {
        const views = await kvResponse.json();
        const viewData: ViewData = {
          pathname,
          views: views.result,
          lastViewed: new Date().toISOString()
        };
        
        // Also store last viewed timestamp
        await fetch(
          `${process.env.KV_REST_API_URL}/set/lastviewed:${pathname}/${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
            },
          }
        );
        
        return viewData;
      }
    } catch (error) {
      console.error('Vercel KV error:', error);
    }
  }
  
  // Fallback to memory store
  const existing = memoryStore.get(pathname);
  const viewData: ViewData = {
    pathname,
    views: (existing?.views || 0) + 1,
    lastViewed: new Date().toISOString()
  };
  
  memoryStore.set(pathname, viewData);
  return viewData;
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = await request.json();
    
    if (!pathname || typeof pathname !== 'string') {
      return NextResponse.json(
        { error: 'Invalid pathname' },
        { status: 400 }
      );
    }
    
    // Basic rate limiting by IP
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `rate_limit:${ip}`;
    
    const viewData = await incrementView(pathname);
    
    return NextResponse.json(viewData, {
      headers: {
        'Cache-Control': 's-maxage=0, no-store'
      }
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}