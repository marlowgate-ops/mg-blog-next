import Link from 'next/link';
import Stars from '../Stars';
import s from './InsuranceCard.module.css';

interface InsuranceCardProps {
  title: string;
  provider: string;
  tagline: string;
  pros: string[];
  ratingValue: number;
  ratingCount: number;
  ctaLabel: string;
  ctaUrl: string;
  updatedAt: string;
  url: string;
}

export default function InsuranceCard({
  title,
  provider,
  tagline,
  pros,
  ratingValue,
  ratingCount,
  ctaLabel,
  ctaUrl,
  updatedAt,
  url
}: InsuranceCardProps) {
  const formattedDate = new Date(updatedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.provider}>{provider}</div>
        <Link href={url} className={s.title}>
          {title}
        </Link>
        <p className={s.tagline}>{tagline}</p>
      </div>

      <div className={s.rating}>
        <Stars score={ratingValue * 20} />
        <span className={s.ratingText}>
          {ratingValue} ({ratingCount.toLocaleString()}件)
        </span>
      </div>

      <div className={s.pros}>
        <h4 className={s.prosTitle}>主な特徴</h4>
        <ul className={s.prosList}>
          {pros.slice(0, 3).map((pro, index) => (
            <li key={index} className={s.prosItem}>
              <span className={s.checkmark}>✓</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>

      <div className={s.footer}>
        <div className={s.updated}>更新日: {formattedDate}</div>
        <Link 
          href={ctaUrl}
          className={s.cta}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}