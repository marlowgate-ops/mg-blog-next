import Link from 'next/link';
import s from './QuickLinks.module.css';

interface QuickLink {
  label: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  { label: '口座開設ガイド', href: '/guides/account-opening' },
  { label: '比較一覧', href: '/best' },
  { label: '保険トップ', href: '/best/insurance' },
  { label: 'レビュー', href: '/reviews' },
];

export default function QuickLinks() {
  return (
    <section className={s.quickLinks}>
      <h3 className={s.title}>Quick Links</h3>
      <div className={s.links}>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={s.link}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}