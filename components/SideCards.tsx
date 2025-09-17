"use client";
import React from "react";
type Card = { title: string; href?: string; desc?: string };
export default function SideCards({ cards }: { cards: Card[] }) {
  return (
    <div className="mg-sidecards">
      {cards.map((c, i) => (
        <a key={i} className="mg-sidecard" href={c.href ?? "#"}>
          <div className="mg-sidecard-title">{c.title}</div>
          {c.desc && <div className="mg-sidecard-desc">{c.desc}</div>}
        </a>
      ))}
      <style jsx global>{`
        .mg-sidecard {
          display:block; background:#fff; border:1px solid #e7e8ea; border-radius:12px;
          padding:12px; text-decoration:none; color:#1f2937;
        }
        .mg-sidecard + .mg-sidecard{ margin-top: 10px; }
        .mg-sidecard-title { font-weight:700; }
        .mg-sidecard-desc { color:#6b7280; font-size:13px; margin-top:4px; }
        .mg-sidecard:hover { background:#f9fafb; }
      `}</style>
    </div>
  );
}
