// app/api/cache/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { globalCache } from '../../../lib/cache/enhanced-cache';

export const runtime = 'edge';

// Cache management API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const key = searchParams.get('key');
  const tags = searchParams.get('tags')?.split(',');
  const pattern = searchParams.get('pattern');

  try {
    switch (action) {
      case 'metrics':
        return NextResponse.json({
          metrics: globalCache.getMetrics(),
          hitRatio: globalCache.getHitRatio(),
          size: globalCache.getSize(),
          keys: globalCache.getKeys(),
        });

      case 'get':
        if (!key) {
          return NextResponse.json({ error: 'Key required' }, { status: 400 });
        }
        const cached = globalCache.get(key);
        return NextResponse.json({
          data: cached.data,
          isStale: cached.isStale,
          etag: cached.etag,
        });

      case 'info':
        if (!key) {
          return NextResponse.json({ error: 'Key required' }, { status: 400 });
        }
        const info = globalCache.getInfo(key);
        return NextResponse.json({ info });

      case 'invalidate':
        if (key) {
          const invalidated = globalCache.invalidate(key, 'api_request');
          return NextResponse.json({ invalidated, key });
        }
        if (tags && tags.length > 0) {
          const count = globalCache.invalidateByTags(tags, 'api_request');
          return NextResponse.json({ invalidated: count, tags });
        }
        if (pattern) {
          const regex = new RegExp(pattern);
          const count = globalCache.invalidateByPattern(regex, 'api_request');
          return NextResponse.json({ invalidated: count, pattern });
        }
        return NextResponse.json({ error: 'Key, tags, or pattern required' }, { status: 400 });

      case 'clear':
        globalCache.clear();
        return NextResponse.json({ cleared: true });

      case 'prune':
        const pruned = globalCache.prune();
        return NextResponse.json({ pruned });

      case 'history':
        const history = globalCache.getInvalidationHistory();
        return NextResponse.json({ history });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cache API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, data, options } = body;

    if (!key || data === undefined) {
      return NextResponse.json({ error: 'Key and data required' }, { status: 400 });
    }

    globalCache.set(key, data, options);
    
    return NextResponse.json({ 
      success: true, 
      key,
      etag: globalCache.getInfo(key)?.etag 
    });
  } catch (error) {
    console.error('Cache POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}