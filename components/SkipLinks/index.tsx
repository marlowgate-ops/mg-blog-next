'use client';

import { useSkipLinks } from '@/lib/hooks/useAccessibility';
import styles from './SkipLinks.module.css';

export function SkipLinks() {
  const { skipToMain, skipToNavigation, skipToSearch } = useSkipLinks();

  return (
    <div className={styles.skipLinks}>
      <button
        className={styles.skipLink}
        onClick={skipToMain}
        onKeyDown={(e) => e.key === 'Enter' && skipToMain()}
      >
        メインコンテンツにスキップ
      </button>
      <button
        className={styles.skipLink}
        onClick={skipToNavigation}
        onKeyDown={(e) => e.key === 'Enter' && skipToNavigation()}
      >
        ナビゲーションにスキップ
      </button>
      <button
        className={styles.skipLink}
        onClick={skipToSearch}
        onKeyDown={(e) => e.key === 'Enter' && skipToSearch()}
      >
        検索にスキップ
      </button>
    </div>
  );
}