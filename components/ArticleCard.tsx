// components/ArticleCard.tsx — 新規追加（カードUI・依存ゼロ）
import Link from "next/link";

export interface Props {
  href: string;
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
}

export default function ArticleCard({ href, title, description, date, tags = [] }: Props) {
  return (
    <article className="card">
      <h3 className="title"><Link href={href}>{title}</Link></h3>
      {description && <p className="desc">{description}</p>}
      <div className="meta">
        {date && <time suppressHydrationWarning dateTime={date}>{date}</time>}
        {tags.length > 0 && (
          <ul className="tags">
            {tags.map(t => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>
      <style jsx>{`
        .card { border:1px solid #e5e7eb; border-radius:16px; padding:16px; background:#fff }
        .title { margin:0 0 6px; font-size:1.05rem; line-height:1.3 }
        .desc { margin:0 0 10px; color:#555; font-size:.95rem; line-height:1.6 }
        .meta { display:flex; gap:10px; align-items:center; justify-content:space-between; }
        .tags { display:flex; gap:6px; list-style:none; padding:0; margin:0 }
        .tags li { font-size:.8rem; border:1px solid #e5e7eb; padding:2px 8px; border-radius:999px }
      `}</style>
    </article>
  );
}
