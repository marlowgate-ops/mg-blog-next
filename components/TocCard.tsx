"use client";
import React from "react";
type TocItem = { href: string; label: string };
export default function TocCard({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState<string | null>(null);
  React.useEffect(()=>{
    const ids = items.map(i=>i.href.replace('#',''));
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    ids.forEach(id=>{ const el = document.getElementById(id); if (el) obs.observe(el); });
    return ()=>obs.disconnect();
  },[items]);
  return (
    <div className="mg-toc">
      <div className="mg-toc-header">目次</div>
      <ol className="mg-toc-list">
        {items.map((x, i) => {
          const id = x.href.replace('#','');
          const current = active === id;
          return <li key={i}><a href={x.href} className={current ? 'is-active' : ''}>{x.label}</a></li>
        })}
      </ol>
      <style jsx global>{`
        .mg-toc { background:#fff; border:1px solid #e7e8ea; border-radius:12px; }
        .mg-toc-header { padding:10px 12px; font-weight:700; border-bottom:1px solid #eef1f5; }
        .mg-toc-list { margin:0; padding:10px 16px 12px 28px; display:grid; grid-template-columns: 1fr 1fr; gap:6px 16px; }
        .mg-toc-list a { color:#111827; text-decoration:none; }
        .mg-toc-list a:hover { text-decoration:underline; }
        .mg-toc-list a.is-active { color:#0c6cd4; font-weight:700; }
        @media (max-width: 720px){ .mg-toc-list{ grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
