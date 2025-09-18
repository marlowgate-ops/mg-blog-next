"use client";
import React from "react";
type TocItem = { href: string; label: string };
type TocProps = { items: TocItem[] };

export default function TocCard({ items }: TocProps) {
  const [active, setActive] = React.useState<string | null>(null);
  const [open, setOpen]     = React.useState(true);

  // Detect first render on mobile -> start closed
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      setOpen(false);
    }
  }, []);

  // Active section highlighter
  React.useEffect(() => {
    const ids = items.map(i => i.href.replace("#", ""));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [items]);

  return (
    <div className="mg-toc">
      <div className="mg-toc-head">
        <h3>目次</h3>
        <button className="mg-toc-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          {open ? "閉じる" : "開く"}
        </button>
      </div>
      {open && (
        <ul className="mg-toc-list">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} className={active === it.href.replace("#","") ? "is-active" : ""}>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .mg-toc { border:1px solid #e7e8ea; border-radius:12px; background:#fff; }
        .mg-toc-head{ display:flex; align-items:center; padding:10px 14px; gap:8px; border-bottom:1px solid #eef0f2; }
        .mg-toc-head h3{ margin:0; font-size:14px; font-weight:700; }
        .mg-toc-toggle{ margin-left:auto; background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:4px 8px; font-size:12px; }
        .mg-toc-list { margin:0; padding:10px 16px 12px 28px; display:grid; grid-template-columns: 1fr 1fr; gap:6px 16px; }
        .mg-toc-list a { color:#111827; text-decoration:none; }
        .mg-toc-list a:hover { text-decoration:underline; }
        .mg-toc-list a.is-active { color:#0c6cd4; font-weight:700; }
        @media (max-width: 720px){ .mg-toc-list{ grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
