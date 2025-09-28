import s from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={s.sidebar}>
      {/* Ranking Widget */}
      <div className={s.widget}>
        <h3 className={s.widgetTitle}>Ranking</h3>
        <div className={s.placeholder}>
          <p className={s.placeholderText}>Coming soon</p>
        </div>
      </div>

      {/* Calendar Widget */}
      <div className={s.widget}>
        <h3 className={s.widgetTitle}>Calendar</h3>
        <div className={s.placeholder}>
          <p className={s.placeholderText}>Economic events</p>
        </div>
      </div>

      {/* Promo Widget */}
      <div className={s.widget}>
        <h3 className={s.widgetTitle}>Promo</h3>
        <div className={s.placeholder}>
          <p className={s.placeholderText}>Special offers</p>
        </div>
      </div>
    </aside>
  );
}