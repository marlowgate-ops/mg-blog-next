import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  // Simple redirect to the search page
  return NextResponse.redirect(new URL(`/search?q=${encodeURIComponent(query)}`, request.url));
}