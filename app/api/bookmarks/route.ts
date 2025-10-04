import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

interface BookmarkItem {
  id: string;
  url: string;
  title: string;
  type: 'article' | 'broker' | 'insurance' | 'tool';
  description?: string;
  thumbnail?: string;
  addedAt: string;
  tags: string[];
}

interface BookmarkCollection {
  anonymousId: string;
  items: BookmarkItem[];
  lastSynced: string;
  deviceCount?: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const anonymousId = searchParams.get('anonymousId');
  
  if (!anonymousId) {
    return NextResponse.json({ error: 'Anonymous ID required' }, { status: 400 });
  }

  try {
    const key = `bookmarks:${anonymousId}`;
    const collection = await kv.get<BookmarkCollection>(key);
    
    if (!collection) {
      return NextResponse.json({ 
        items: [], 
        anonymousId,
        lastSynced: new Date().toISOString() 
      });
    }
    
    return NextResponse.json(collection);
    
  } catch (error) {
    console.error('Bookmark fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymousId, items } = body;
    
    if (!anonymousId || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const collection: BookmarkCollection = {
      anonymousId,
      items,
      lastSynced: new Date().toISOString(),
      deviceCount: 1
    };
    
    const key = `bookmarks:${anonymousId}`;
    await kv.set(key, collection, { ex: 60 * 60 * 24 * 90 }); // 90 days
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Bookmark sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync bookmarks' },
      { status: 500 }
    );
  }
}