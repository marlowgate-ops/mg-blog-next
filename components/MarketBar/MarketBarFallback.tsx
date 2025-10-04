import styles from './MarketBar.module.css';

export function MarketBarFallback() {
  return (
    <div className={styles.marketBar} role="banner" aria-label="Market links">
      <div className={styles.container}>
        <span className={styles.label}>市場</span>
        <div className={styles.fallbackLinks}>
          <a 
            href="https://finance.yahoo.co.jp/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.fallbackLink}
          >
            Yahoo!ファイナンス
          </a>
          <a 
            href="https://www.bloomberg.co.jp/markets" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.fallbackLink}
          >
            Bloomberg
          </a>
          <a 
            href="https://www.nikkei.com/markets/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.fallbackLink}
          >
            日経
          </a>
        </div>
      </div>
    </div>
  );
}