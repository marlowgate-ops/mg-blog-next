import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { safeKvSet, safeKvZincrby, safeKvExists } from '@/lib/kv';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;
    
    // Validate path starts with "/"
    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return NextResponse.json(
        { ok: false, error: 'Invalid path' },
        { status: 400 }
      );
    }
    
    // Get client IP for deduplication
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    // Dedupe by IP for 1 hour (mg:seen:${ip}:${path})
    const dedupeKey = `mg:seen:${ip}:${path}`;
    const alreadySeen = await safeKvExists(dedupeKey);
    
    if (alreadySeen) {
      // Already counted this IP for this path in the last hour
      return NextResponse.json({ ok: true, dedupe: true });
    }
    
    // Set deduplication key with 1 hour expiry
    await safeKvSet(dedupeKey, '1', { ex: 3600 }); // 1 hour = 3600 seconds
    
    // Increment sorted sets
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Increment all-time popular counter
    await safeKvZincrby('mg:popular:all', 1, path);
    
    // Increment daily bucket
    await safeKvZincrby(`mg:popular:${today}`, 1, path);
    
    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('Error tracking view:', error);
    // Never throw - always return graceful response
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}