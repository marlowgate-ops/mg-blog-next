'use client';

import { MarketSymbol } from '@/lib/market/provider';
import { useState, useEffect } from 'react';
import styles from './MarketBar.module.css';

interface MarketBarClientProps {
  quotes: MarketSymbol[];
}

export function MarketBarClient({ quotes: initialQuotes }: MarketBarClientProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [isLoading, setIsLoading] = useState(false);

  // Optional: Add periodic refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/market-data');
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes || []);
        }
      } catch (error) {
        console.warn('Failed to refresh market data:', error);
      } finally {
        setIsLoading(false);
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  if (!quotes.length) {
    return null;
  }

  return (
    <div className={styles.marketBar} role="banner" aria-label="Market snapshot">
      <div className={styles.container}>
        <span className={styles.label}>市場</span>
        <div className={styles.quotes}>
          {quotes.map((quote) => (
            <div key={quote.symbol} className={styles.quote}>
              <span className={styles.symbol}>{quote.name}</span>
              <span className={styles.price}>
                {quote.currency === 'JPY' 
                  ? `¥${quote.price.toFixed(2)}`
                  : `$${quote.price.toFixed(2)}`
                }
              </span>
              <span 
                className={`${styles.change} ${
                  quote.change >= 0 ? styles.positive : styles.negative
                }`}
              >
                {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
        {isLoading && (
          <div className={styles.loading} aria-label="Updating...">
            ↻
          </div>
        )}
      </div>
    </div>
  );
}