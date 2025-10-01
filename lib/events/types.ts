// Financial and Insurance Events Types

export interface FinancialEvent {
  id: string;
  title: string;
  description: string;
  category: 'monetary-policy' | 'economic-data' | 'insurance-deadline' | 'earnings' | 'regulation' | 'market-holiday';
  date: string; // ISO 8601 format
  time?: string; // HH:MM format (JST)
  timezone: 'JST' | 'UTC' | 'EST' | 'GMT';
  importance: 'high' | 'medium' | 'low';
  source: string;
  url?: string;
  country: 'JP' | 'US' | 'EU' | 'GB' | 'GLOBAL';
  recurring?: 'monthly' | 'quarterly' | 'annually' | 'weekly';
  tags: string[];
  featured: boolean;
}

export interface EventCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface WeeklyEventSchedule {
  weekStart: string; // ISO date (Monday)
  weekEnd: string;   // ISO date (Sunday)
  events: FinancialEvent[];
}

export interface EventsCalendar {
  currentWeek: WeeklyEventSchedule;
  nextWeek: WeeklyEventSchedule;
  upcoming: FinancialEvent[];
}