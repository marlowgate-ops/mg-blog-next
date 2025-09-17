"use client";
import React from "react";
type Props = { rank: number; brand: string; score: number; highlights: string[]; cautions?: string[]; ctaHref?: string; ctaLabel?: string; badge?: string; state?: "active" | "preparing"; };
export default function RankingCard({ rank, brand, score, highlights, cautions = [], ctaHref = "#", ctaLabel = "公式サイトで口座開設", badge, state = "active", }: Props) {
  const isPreparing = state === "preparing";
  return (
    <article className={`mg-rank-card ${isPreparing ? "is-preparing" : ""}`}>
      <div className="mg-rank-left">
        <div className="mg-rank-no">{rank}</div>
        <div className="mg-rank-brand">
          <strong>{brand}</strong>
          {badge && <span className="mg-badge">{badge}</span>}
        </div>
      </div>
      <div className="mg-rank-main">
        <div className="mg-rank-score" aria-label={`総合スコア ${score}/5`}>
          <div className="mg-meter"><div className="mg-meter-bar" style={{ width: `${Math.min(100, (score/5)*100)}%` }} /></div>
          <span className="mg-score-text">{score.toFixed(1)} / 5</span>
        </div>
        <ul className="mg-pros">{highlights.map((h, i) => <li key={i}>・{h}</li>)}</ul>
        {cautions.length > 0 && (<ul className="mg-cons">{cautions.map((c, i) => <li key={i}>・{c}</li>)}</ul>)}
      </div>
      <div className="mg-rank-cta">
        <a className={`mg-btn ${isPreparing ? "mg-btn--disabled" : ""}`} href={isPreparing ? undefined : ctaHref} {...(isPreparing ? { "aria-disabled": true } : {})}>
          {isPreparing ? "準備中" : ctaLabel}
        </a>
      </div>
      <style jsx global>{`
        .mg-rank-card { display:grid; grid-template-columns:120px 1fr 180px; gap:16px; padding:16px; border:1px solid #e7e8ea; border-radius:10px; background:#fff; }
        .mg-rank-card + .mg-rank-card { margin-top: 12px; }
        .mg-rank-left { display:flex; gap:12px; align-items:center; }
        .mg-rank-no { width:28px; height:28px; border-radius:9999px; display:inline-flex; align-items:center; justify-content:center; font-weight:700; color:#fff; background:#0066cc; }
        .mg-rank-brand strong { font-size:16px; }
        .mg-badge { margin-left:8px; font-size:12px; color:#666; background:#f5f7fa; border-radius:9999px; padding:2px 8px; }
        .mg-rank-score { display:flex; align-items:center; gap:10px; }
        .mg-meter { width:160px; height:8px; border-radius:9999px; background:#eef1f5; overflow:hidden; }
        .mg-meter-bar { height:100%; background: linear-gradient(90deg, #4caf50, #8bc34a); }
        .mg-score-text { font-size:12px; color:#666; }
        .mg-pros, .mg-cons { margin:8px 0 0; padding-left:0; list-style:none; font-size:14px; color:#333; }
        .mg-cons { color:#666; }
        .mg-rank-cta { display:flex; align-items:center; justify-content:flex-end; }
        .mg-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 14px; background:#0070f3; color:#fff; border-radius:8px; font-weight:700; text-decoration:none; }
        .mg-btn--disabled { background:#cfcfcf; pointer-events:none; }
        .is-preparing { opacity:.8; }
        @media (max-width: 960px) { .mg-rank-card { grid-template-columns:1fr; } .mg-rank-cta { justify-content:flex-start; } }
      `}</style>
    </article>
  );
}
