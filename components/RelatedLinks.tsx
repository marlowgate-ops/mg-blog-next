"use client";
import React from "react";
export default function RelatedLinks(){
  const groups = [
    { title: "ネット証券・比較", links: ["取引手数料", "取引ツール", "スマホアプリ", "キャンペーン", "人気ランキング"] },
    { title: "初心者向け入門", links: ["初めての証券口座", "NISAの基本", "指標の読み方", "手数料の仕組み"] },
    { title: "用語・ガイド", links: ["スプレッドとは", "約定スピード", "ロスカット", "板情報"] },
  ];
  return (
    <div className="mg-related">
      {groups.map((g,i)=>(
        <div className="mg-related-col" key={i}>
          <div className="mg-related-title">{g.title}</div>
          <ul>{g.links.map((l,idx)=>(<li key={idx}><a href="#">{l}</a></li>))}</ul>
        </div>
      ))}
      <style jsx>{`
        .mg-related{ display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; padding:16px; background:#111827; border-radius:12px; }
        .mg-related-title{ color:#fff; font-weight:700; margin-bottom:6px; }
        .mg-related a{ color:#cbd5e1; text-decoration:none; }
        .mg-related a:hover{ text-decoration:underline; }
        .mg-related ul{ margin:0; padding-left:18px; }
        @media (max-width: 960px){ .mg-related{ grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
