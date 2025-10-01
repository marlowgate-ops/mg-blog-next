import { NextRequest, NextResponse } from 'next/server';
import { upcomingEvents } from '@/lib/events/data';
import { generateUpcomingICS } from '@/lib/events/ics';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30'; // days
    const category = url.searchParams.get('category');
    
    let events = upcomingEvents;
    
    // Filter by category if specified
    if (category) {
      events = events.filter(event => event.category === category);
    }
    
    // Generate ICS content
    const icsContent = generateUpcomingICS(events, parseInt(period));
    
    // Set appropriate headers for ICS file download
    const headers = new Headers();
    headers.set('Content-Type', 'text/calendar; charset=utf-8');
    headers.set('Content-Disposition', 'attachment; filename="financial-events.ics"');
    headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    return new NextResponse(icsContent, { headers });
  } catch (error) {
    console.error('Error generating ICS:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar file' },
      { status: 500 }
    );
  }
}

// Export static params for static generation
export const dynamic = 'force-dynamic';