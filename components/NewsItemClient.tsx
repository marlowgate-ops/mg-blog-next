'use client';

interface NewsItemClientProps {
  item: {
    id: string;
    title: string;
    url: string;
    source: string;
    publishedAt: string;
  };
  className?: string;
  children: React.ReactNode;
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: any) => void;
  }
}

export default function NewsItemClient({ item, className, children }: NewsItemClientProps) {
  const handleClick = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
    
    // GA4 analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'news_item_click', {
        source: item.source,
        outlet_url: item.url,
        news_title: item.title,
        location: 'home_page'
      });
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
}