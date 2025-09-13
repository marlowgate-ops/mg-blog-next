'use client';

import styles from './cta.module.css';

const url =
  process.env.NEXT_PUBLIC_CTA_URL ||
  process.env.NEXT_PUBLIC_HERO_CTA_URL ||
  '/';

const label =
  process.env.NEXT_PUBLIC_CTA_LABEL ||
  process.env.NEXT_PUBLIC_HERO_CTA_LABEL ||
  '詳細を見る';

const benefits =
  process.env.NEXT_PUBLIC_CTA_BENEFITS ||
  process.env.NEXT_PUBLIC_HERO_CTA_BENEFITS ||
  '実務テンプレ｜ICS検証ノート';

export default function ArticleCTA() {
  return (
    <aside className={styles.band} aria-label="Post CTA">
      <div className={styles.meta}>
        <div className={styles.title}>{benefits}</div>
        <p className={styles.desc}>
          読み終わった勢いのまま、あなたの成果につながる具体アクションへ。
        </p>
      </div>
      <a className={styles.btn} href={url} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </aside>
  );
}
