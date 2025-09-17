"use client";
import React from "react";
type TocItem = { href: string; label: string; note?: string };
export default function TocCard({ items }: { items: TocItem[] }) {
  return (
    <div className="mg-toc">
      <div className="mg-toc-header">目次</div>
      <ol className="mg-toc-list">
        {items.map((x, i) => (
          <li key={i}><a href={x.href}>{x.label}</a></li>
        ))}
      </ol>
      <style jsx global>{`
        .mg-toc { background:#fff; border:1px solid #e7e8ea; border-radius:12px; }
        .mg-toc-header { padding:10px 12px; font-weight:700; border-bottom:1px solid #eef1f5; }
        .mg-toc-list { margin:0; padding:10px 16px 12px 28px; display:grid; grid-template-columns: 1fr 1fr; gap:6px 16px; }
        .mg-toc-list a { color:#111827; text-decoration:none; }
        .mg-toc-list a:hover { text-decoration:underline; }
        @media (max-width: 720px){ .mg-toc-list{ grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
