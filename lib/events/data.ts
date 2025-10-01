import { FinancialEvent, EventCategory, WeeklyEventSchedule, EventsCalendar } from './types';

// Event Categories
export const eventCategories: EventCategory[] = [
  {
    id: 'monetary-policy',
    name: '金融政策',
    description: '中央銀行の政策決定会合',
    icon: '🏦',
    color: '#1f2937'
  },
  {
    id: 'economic-data',
    name: '経済指標',
    description: 'GDP、CPI、雇用統計など',
    icon: '📊',
    color: '#059669'
  },
  {
    id: 'insurance-deadline',
    name: '保険締切',
    description: '申込・更新期限',
    icon: '🛡️',
    color: '#dc2626'
  },
  {
    id: 'earnings',
    name: '決算発表',
    description: '企業業績発表',
    icon: '📈',
    color: '#7c3aed'
  },
  {
    id: 'regulation',
    name: '規制発表',
    description: '金融規制・法改正',
    icon: '⚖️',
    color: '#ea580c'
  },
  {
    id: 'market-holiday',
    name: '市場休場',
    description: '取引所休業日',
    icon: '🏖️',
    color: '#6b7280'
  }
];

// Sample Events Data (Editorial Curation)
export const upcomingEvents: FinancialEvent[] = [
  // October 2025 FOMC Meeting
  {
    id: 'fomc-2025-10-29',
    title: 'FOMC政策金利発表',
    description: '米連邦公開市場委員会による政策金利決定',
    category: 'monetary-policy',
    date: '2025-10-29',
    time: '03:00',
    timezone: 'JST',
    importance: 'high',
    source: 'Federal Reserve',
    url: 'https://www.federalreserve.gov/',
    country: 'US',
    recurring: 'quarterly',
    tags: ['FOMC', 'Fed', '金利', 'アメリカ'],
    featured: true
  },
  
  // Bank of Japan Meeting
  {
    id: 'boj-2025-10-31',
    title: '日銀金融政策決定会合',
    description: '日本銀行による金融政策の決定',
    category: 'monetary-policy',
    date: '2025-10-31',
    time: '14:00',
    timezone: 'JST',
    importance: 'high',
    source: '日本銀行',
    url: 'https://www.boj.or.jp/',
    country: 'JP',
    recurring: 'monthly',
    tags: ['日銀', 'BOJ', '金融政策', '日本'],
    featured: true
  },

  // US CPI Data
  {
    id: 'us-cpi-2025-11-13',
    title: '米国CPI発表',
    description: '米国消費者物価指数（10月分）',
    category: 'economic-data',
    date: '2025-11-13',
    time: '22:30',
    timezone: 'JST',
    importance: 'high',
    source: 'Bureau of Labor Statistics',
    country: 'US',
    recurring: 'monthly',
    tags: ['CPI', 'インフレ', 'アメリカ', '物価'],
    featured: true
  },

  // Japan GDP
  {
    id: 'japan-gdp-q3-2025',
    title: '日本GDP速報値（Q3）',
    description: '2025年第3四半期GDP速報',
    category: 'economic-data',
    date: '2025-11-15',
    time: '08:50',
    timezone: 'JST',
    importance: 'high',
    source: '内閣府',
    country: 'JP',
    recurring: 'quarterly',
    tags: ['GDP', '経済成長', '日本'],
    featured: true
  },

  // Insurance Deadlines
  {
    id: 'life-insurance-year-end-2025',
    title: '生命保険年末調整締切',
    description: '生命保険料控除申告書提出期限',
    category: 'insurance-deadline',
    date: '2025-12-31',
    timezone: 'JST',
    importance: 'medium',
    source: '国税庁',
    country: 'JP',
    recurring: 'annually',
    tags: ['生命保険', '年末調整', '税控除'],
    featured: false
  },

  // Auto Insurance Renewal Season
  {
    id: 'auto-insurance-renewal-2026',
    title: '自動車保険更新期間開始',
    description: '2026年度自動車保険更新手続き開始',
    category: 'insurance-deadline',
    date: '2025-12-01',
    timezone: 'JST',
    importance: 'medium',
    source: '損害保険協会',
    country: 'JP',
    recurring: 'annually',
    tags: ['自動車保険', '更新', '損保'],
    featured: false
  },

  // Market Holidays
  {
    id: 'culture-day-2025',
    title: '文化の日（市場休場）',
    description: '東京証券取引所休業日',
    category: 'market-holiday',
    date: '2025-11-03',
    timezone: 'JST',
    importance: 'low',
    source: '東京証券取引所',
    country: 'JP',
    tags: ['祝日', '市場休場', 'TSE'],
    featured: false
  },

  // NFP (Non-farm Payrolls)
  {
    id: 'us-nfp-2025-11-01',
    title: '米国雇用統計発表',
    description: '非農業部門雇用者数（10月分）',
    category: 'economic-data',
    date: '2025-11-01',
    time: '22:30',
    timezone: 'JST',
    importance: 'high',
    source: 'Bureau of Labor Statistics',
    country: 'US',
    recurring: 'monthly',
    tags: ['雇用統計', 'NFP', 'アメリカ', '労働市場'],
    featured: true
  }
];

// Utility Functions
export function getEventsByWeek(startDate: string): WeeklyEventSchedule {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  const weekEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= start && eventDate <= end;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    weekStart: start.toISOString().split('T')[0],
    weekEnd: end.toISOString().split('T')[0],
    events: weekEvents
  };
}

export function getCurrentWeekEvents(): WeeklyEventSchedule {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  
  return getEventsByWeek(monday.toISOString().split('T')[0]);
}

export function getNextWeekEvents(): WeeklyEventSchedule {
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() - today.getDay() + 8);
  
  return getEventsByWeek(nextMonday.toISOString().split('T')[0]);
}

export function getEventsCalendar(): EventsCalendar {
  const currentWeek = getCurrentWeekEvents();
  const nextWeek = getNextWeekEvents();
  
  const upcoming = upcomingEvents
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  return {
    currentWeek,
    nextWeek,
    upcoming
  };
}

export function getEventsByCategory(categoryId: string): FinancialEvent[] {
  return upcomingEvents.filter(event => event.category === categoryId);
}

export function getFeaturedEvents(): FinancialEvent[] {
  return upcomingEvents.filter(event => event.featured);
}

export function getEventById(id: string): FinancialEvent | undefined {
  return upcomingEvents.find(event => event.id === id);
}

// Event matching for news integration
export function matchEventWithNews(newsTitle: string): FinancialEvent | null {
  const keywords = [
    { event: 'fomc', keywords: ['FOMC', 'Fed', '連邦準備', '政策金利'] },
    { event: 'boj', keywords: ['日銀', 'BOJ', '金融政策', '黒田'] },
    { event: 'cpi', keywords: ['CPI', '消費者物価', 'インフレ'] },
    { event: 'gdp', keywords: ['GDP', '国内総生産', '経済成長'] },
    { event: 'nfp', keywords: ['雇用統計', 'NFP', '失業率'] }
  ];

  for (const matcher of keywords) {
    if (matcher.keywords.some(keyword => newsTitle.includes(keyword))) {
      const relatedEvent = upcomingEvents.find(event => 
        event.tags.some(tag => matcher.keywords.includes(tag))
      );
      if (relatedEvent) return relatedEvent;
    }
  }

  return null;
}