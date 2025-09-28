import Link from 'next/link';
import s from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={s.sidebar}>
      {/* Market Blackout Calendar Widget */}
      <div className={s.widget}>
        <h3 className={s.widgetTitle}>Market Blackout Calendar</h3>
        <div className={s.content}>
          <p className={s.description}>
            重要な経済指標発表や市場休場日を事前にチェックして、取引計画を立てましょう。
          </p>
          <Link href="/products/calendars" className={s.cta}>
            カレンダーを見る →
          </Link>
        </div>
      </div>

      {/* Promo Widget */}
      <div className={s.widget}>
        <h3 className={s.widgetTitle}>おすすめ</h3>
        <div className={s.content}>
          <p className={s.description}>
            実務で使えるテンプレートとノウハウを提供しています。
          </p>
          <Link 
            href={process.env.NEXT_PUBLIC_CTA_URL || '/gumroad'} 
            className={s.ctaButton}
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </aside>
  );
}