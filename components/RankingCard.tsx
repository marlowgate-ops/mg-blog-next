"use client";
import React from "react";
import s from "@/app/best/layout.module.css";
type SubScores = { execution: number; app: number; cost: number };
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
function initials(name:string){ const t = name.replace(/[（(].*?[)）]/g,''); const s = t.split(/[・\s]/).map(x=>x[0]).join(''); return s.slice(0,3).toUpperCase(); }
function Stars({ value }: { value: number }){
  const n = Math.max(0, Math.min(5, value));
  const full = Math.floor(n);
  const half = n - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const Star = ({fill}:{fill:boolean}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={fill ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1"/>
    </svg>
  );
  const Half = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <defs><linearGradient id="half" x1="0" x2="1"><stop offset="50%" stop-color="#f59e0b"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#half)" stroke="#f59e0b" strokeWidth="1"/>
    </svg>
  );
  return <span className={s.stars} aria-label={`評価 ${n} / 5`}>
    {Array.from({length: full}).map((_,i)=><Star key={'f'+i} fill/>)}
    {half ? <Half key="h"/> : null}
    {Array.from({length: empty}).map((_,i)=><Star key={'e'+i} fill={false}/>)}
  </span>;
}
function Bar({ value }: { value: number }){
  const w = Math.min(100, Math.round((value/5)*100));
  return <div className={s.scoreBar}><div className={s.scoreBar_inner} style={{width:`${w}%`}}/></div>;
}
export default function RankingCard({ rank, brand, score, highlights, cautions = [], ctaHref = "#", ctaLabel = "公式サイトで口座開設", state = "active", subs }: Props) {
  const isPreparing = state === "preparing";
  return (
    <article className={`${s.rankingCard} ${isPreparing ? s.isPreparing : ""}`}>
      <div className={s.rankingCard_left}>
        <div className={s.rankingCard_no}>{rank}</div>
        <div className={s.rankingCard_logo} aria-hidden>{initials(brand)}</div>
        <div className={s.rankingCard_brand}><strong>{brand}</strong></div>
      </div>
      <div className={s.rankingCard_main}>
        <div className={s.rankingCard_score} aria-label={`総合スコア ${score}/5`}>
          <Bar value={score} /><span className={s.scoreText}>{score.toFixed(1)} / 5</span>
        </div>
        {subs && (
          <div className={s.scoreRows}>
            <div className={s.scoreRow}>
              <span>コスト</span>
              <div className={s.scoreBar}>
                <span style={{ '--w': `${(subs.cost / 5) * 100}%` } as React.CSSProperties}></span>
              </div>
            </div>
            <div className={s.scoreRow}>
              <span>信頼性</span>
              <div className={s.scoreBar}>
                <span style={{ '--w': `${(subs.execution / 5) * 100}%` } as React.CSSProperties}></span>
              </div>
            </div>
            <div className={s.scoreRow}>
              <span>アプリ</span>
              <div className={s.scoreBar}>
                <span style={{ '--w': `${(subs.app / 5) * 100}%` } as React.CSSProperties}></span>
              </div>
            </div>
          </div>
        )}
        <ul className={s.pros}>{highlights.map((h, i) => <li key={i}>・{h}</li>)}</ul>
        {cautions.length > 0 && (<ul className={s.cons}>{cautions.map((c, i) => <li key={i}>・{c}</li>)}</ul>)}
      </div>
      <div className={s.rankingCard_cta}>
        <a className={`${s.btn} ${isPreparing ? s.btn_disabled : ""}`} href={isPreparing ? undefined : ctaHref} {...(isPreparing ? { "aria-disabled": true } : {})}>
          {isPreparing ? "準備中" : ctaLabel}
        </a>
      </div>
    </article>
  );
}
