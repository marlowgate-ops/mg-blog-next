import { FinancialEvent } from './types';

// ICS Calendar Generation
export function generateICSContent(events: FinancialEvent[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marlow Gate//Financial Events Calendar//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:金融・保険イベントカレンダー',
    'X-WR-CALDESC:MarlowtGateによる金融・保険関連イベント',
    'X-WR-TIMEZONE:Asia/Tokyo',
    ''
  ].join('\r\n');

  events.forEach(event => {
    const eventDate = new Date(event.date);
    
    // Format date for ICS (YYYYMMDD or YYYYMMDDTHHMMSSZ)
    let dtstart: string;
    let dtend: string;
    
    if (event.time) {
      // Timed event
      const [hours, minutes] = event.time.split(':');
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Convert to UTC if needed
      if (event.timezone === 'JST') {
        startDateTime.setHours(startDateTime.getHours() - 9);
      }
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1); // 1 hour duration
      
      dtstart = 'DTSTART:' + startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      dtend = 'DTEND:' + endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    } else {
      // All-day event
      const dateStr = eventDate.toISOString().split('T')[0].replace(/[-]/g, '');
      dtstart = 'DTSTART;VALUE=DATE:' + dateStr;
      dtend = 'DTEND;VALUE=DATE:' + dateStr;
    }

    // Generate unique ID
    const uid = `${event.id}@marlowgate.com`;
    
    // Escape special characters for ICS
    const escapeICS = (str: string): string => {
      return str
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
    };

    const eventContent = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      dtstart,
      dtend,
      `SUMMARY:${escapeICS(event.title)}`,
      `DESCRIPTION:${escapeICS(event.description)}${event.url ? '\\n\\n詳細: ' + event.url : ''}`,
      `CATEGORIES:${escapeICS(getCategoryName(event.category))}`,
      `LOCATION:${getLocationByCountry(event.country)}`,
      `STATUS:CONFIRMED`,
      `TRANSP:OPAQUE`,
      `SEQUENCE:0`,
      'END:VEVENT',
      ''
    ].join('\r\n');

    icsContent += eventContent;
  });

  icsContent += 'END:VCALENDAR\r\n';
  
  return icsContent;
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'monetary-policy': '金融政策',
    'economic-data': '経済指標',
    'insurance-deadline': '保険締切',
    'earnings': '決算発表',
    'regulation': '規制発表',
    'market-holiday': '市場休場'
  };
  
  return categoryMap[category] || category;
}

function getLocationByCountry(country: string): string {
  const locationMap: Record<string, string> = {
    'JP': '日本',
    'US': 'アメリカ',
    'EU': 'ヨーロッパ',
    'GB': 'イギリス',
    'GLOBAL': 'グローバル'
  };
  
  return locationMap[country] || country;
}

// Generate ICS for specific time periods
export function generateWeeklyICS(events: FinancialEvent[]): string {
  return generateICSContent(events);
}

export function generateMonthlyICS(events: FinancialEvent[]): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const monthlyEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= nextMonth;
  });
  
  return generateICSContent(monthlyEvents);
}

export function generateUpcomingICS(events: FinancialEvent[], days: number = 30): string {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= futureDate;
  });
  
  return generateICSContent(upcomingEvents);
}