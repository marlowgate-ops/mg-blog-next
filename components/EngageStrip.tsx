"use client";
import React from "react";

export default function EngageStrip(){
  const items = [
    {t:"最短で比較完了", d:"要点だけに整理。迷い時間を削減。"},
    {t:"失敗パターン回避", d:"手数料の罠・約定の盲点をチェック。"},
    {t:"無料で始めやすい", d:"口座開設/維持は無料。やめても費用ゼロ。"},
  ];
  return (
    <div className="mg-engage">
      {items.map((it,i)=>(
        <div key={i} className="mg-engage-card">
          <div className="mg-engage-title">{it.t}</div>
          <div className="mg-engage-desc">{it.d}</div>
        </div>
      ))}
      <style jsx>{`
        .mg-engage{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:14px 0 2px;}
        .mg-engage-card{background:#fff;border:1px solid #e6e9ef;border-radius:12px;padding:12px 14px;box-shadow:0 6px 18px rgba(17,24,39,.05)}
        .mg-engage-title{font-weight:700;font-size:14px;margin-bottom:4px}
        .mg-engage-desc{font-size:12px;color:#4b5563}
        @media(max-width:900px){.mg-engage{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
