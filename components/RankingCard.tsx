"use client";
import React from "react";
type SubScores = { execution: number; app: number; cost: number }; // 0-5
type Props = {
  rank: number;
  brand: string;
  score: number;
  highlights: string[];
  cautions?: string[];
  ctaHref?: string;
  ctaLabel?: string;
  state?: "active" | "preparing";
  subs?: SubScores;
};

function Bar({ value }: { value: number }){
  const w = Math.min(100, Math.round((value/5)*100));
  return <div className="mg-meter"><div className="mg-meter-bar" style={{width:`${w}%`}}/></div>;
}

export default function RankingCard({
  rank, brand, score, highlights, cautions = [], ctaHref = "#", ctaLabel = "公式サイトで口座開設", state = "active", subs
}: Props) {
  const isPreparing = state === "preparing";
  return (
    <article className={`mg-rank-card ${isPreparing ? "is-preparing" : ""}`}>
      <div className="mg-rank-left">
        <div className="mg-rank-no">{rank}</div>
        <div className="mg-rank-brand"><strong>{brand}</strong></div>
      </div>
      <div className="mg-rank-main">
        <div className="mg-rank-score" aria-label={`総合スコア ${score}/5`}>
          <Bar value={score} />
          <span className="mg-score-text">{score.toFixed(1)} / 5</span>
        </div>
        {subs && (
          <div className="mg-submeters">
            <div><span>約定</span><Bar value={subs.execution}/></div>
            <div><span>アプリ</span><Bar value={subs.app}/></div>
            <div><span>コスト</span><Bar value={subs.cost}/></div>
          </div>
        )}
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
        .mg-rank-score { display:flex; align-items:center; gap:10px; }
        .mg-meter { width:160px; height:8px; border-radius:9999px; background:#eef1f5; overflow:hidden; }
        .mg-meter-bar { height:100%; background: linear-gradient(90deg, #4caf50, #8bc34a); }
        .mg-score-text { font-size:12px; color:#666; }
        .mg-submeters{ display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; align-items:center; margin-top:6px; }
        .mg-submeters span{ display:inline-block; width:40px; font-size:12px; color:#6b7280; }
        .mg-pros, .mg-cons { margin:8px 0 0; padding-left:0; list-style:none; font-size:14px; color:#333; }
        .mg-cons { color:#666; }
        .mg-rank-cta { display:flex; align-items:center; justify-content:flex-end; }
        .mg-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 14px; background:#0070f3; color:#fff; border-radius:8px; font-weight:700; text-decoration:none; }
        .mg-btn--disabled { background:#cfcfcf; pointer-events:none; }
        .is-preparing { opacity:.85; }
        @media (max-width: 960px) { .mg-rank-card { grid-template-columns:1fr; } .mg-rank-cta { justify-content:flex-start; } }
      `}</style>
    </article>
  );
}
