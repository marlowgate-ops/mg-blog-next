"use client";
import React from "react";

export default function AuthorMeta() {
  const updated = "2025-09-19";
  return (
    <div className="mg-author-meta" aria-label="記事情報">
      <img className="mg-author-avatar" src="/authors/marlow-gate.png" width="28" height="28" alt="Marlow Gate 編集部" />
      <div className="mg-author-text">
        <div className="mg-author-name">Marlow Gate 編集部</div>
        <div className="mg-author-updated"><time dateTime={updated}>2025-09-19 更新</time></div>
      </div>
      <style jsx>{`
        .mg-author-meta { display:flex; align-items:center; gap:10px; margin:8px 0 14px; color:#6b7280; font-size:12px; }
        .mg-author-avatar { width:28px; height:28px; border-radius:9999px; }
        .mg-author-name { font-weight:700; color:#374151; }
      `}</style>
    </div>
  );
}
