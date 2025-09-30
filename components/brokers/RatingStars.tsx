import Stars from '../Stars';
import s from './RatingStars.module.css';

interface RatingStarsProps {
  value: number;
  count: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function RatingStars({ value, count, showCount = true, size = 'medium' }: RatingStarsProps) {
  return (
    <div className={`${s.rating} ${s[size]}`}>
      <div className={s.stars}>
        <Stars score={value * 20} />
      </div>
      <div className={s.details}>
        <span className={s.value}>{value.toFixed(1)}</span>
        {showCount && (
          <span className={s.count}>（{count.toLocaleString()}件の評価）</span>
        )}
      </div>
    </div>
  );
}