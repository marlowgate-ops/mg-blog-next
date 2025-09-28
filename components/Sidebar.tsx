import Link from 'next/link';
import PopularNow from './Sidebar/PopularNow';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Popular Now Widget */}
      <PopularNow />
      
      {/* Market Blackout Calendar Widget */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Market Blackout Calendar</h3>
        <div className={styles.content}>
          <p className={styles.description}>
            重要な経済指標発表や市場休場日を事前にチェックして、取引計画を立てましょう。
          </p>
          <Link href="/products/calendars" className={styles.cta}>
            カレンダーを見る →
          </Link>
        </div>
      </div>

      {/* Promo Widget */}
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>おすすめ</h3>
        <div className={styles.content}>
          <p className={styles.description}>
            実務で使えるテンプレートとノウハウを提供しています。
          </p>
          <Link 
            href={process.env.NEXT_PUBLIC_CTA_URL || '/gumroad'} 
            className={styles.ctaButton}
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </aside>
  );
}