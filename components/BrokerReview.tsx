"use client";
import React from "react";

type ReviewProps = {
  id: string;
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  who: string[];
  detail: string;
};

export default function BrokerReview({id, title, summary, pros, cons, who, detail}: ReviewProps){
  return (
    <section id={id} className="mg-review">
      <h3 className="mg-review-title">{title}</h3>
      <p className="mg-review-summary">{summary}</p>
      <div className="mg-review-grid">
        <div>
          <h4>強み</h4>
          <ul>{pros.map((v,i)=>(<li key={i}>・{v}</li>))}</ul>
          <h4>留意点</h4>
          <ul>{cons.map((v,i)=>(<li key={i}>・{v}</li>))}</ul>
        </div>
        <aside>
          <h4>こんな人に合う</h4>
          <ul>{who.map((v,i)=>(<li key={i}>・{v}</li>))}</ul>
        </aside>
      </div>
      <div className="mg-review-detail">{detail}</div>
      <style jsx>{`
        .mg-review{margin:26px 0;padding:18px;border:1px solid #e6e9ef;border-radius:14px;background:#fff}
        .mg-review-title{font-size:18px;font-weight:800;margin:0 0 8px}
        .mg-review-summary{color:#374151;margin:0 0 12px}
        .mg-review-grid{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:12px}
        .mg-review h4{font-size:14px;margin:10px 0 6px}
        .mg-review ul{margin:0;padding-left:18px}
        .mg-review-detail{border-top:1px dashed #e5e7eb;padding-top:12px;line-height:1.9;white-space:pre-wrap}
        @media(max-width:900px){.mg-review-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
