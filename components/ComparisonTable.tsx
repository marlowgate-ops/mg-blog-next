"use client";
import React from "react";
type Row = { brand: string; product: string; platform: string; cost: string; note?: string; state?: "active" | "preparing"; ctaHref?: string; };
export default function ComparisonTable({ rows }: { rows: Row[] }) {
  return (
    <div className="mg-table-wrap" role="region" aria-label="主要スペック比較表">
      <table className="mg-compare">
        <thead><tr><th>業者</th><th>口座/商品</th><th>プラットフォーム</th><th>コスト</th><th>備考</th><th>口座開設</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.state === "preparing" ? "is-preparing" : ""}>
              <td>{r.brand}</td><td>{r.product}</td><td>{r.platform}</td><td>{r.cost}</td><td>{r.note ?? "—"}</td>
              <td>{r.state === "preparing" ? <span className="mg-tag">準備中</span> : <a className="mg-link-btn" href={r.ctaHref ?? "#"}>公式サイトで口座開設</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mg-scroll-hint" aria-hidden="true">← 横スクロールできます →</div>
      <style jsx global>{`
        .mg-table-wrap { position:relative; overflow-x:auto; border:1px solid #e7e8ea; border-radius:10px; }
        .mg-compare { width:100%; border-collapse:collapse; min-width:780px; }
        .mg-compare th, .mg-compare td { padding:12px 10px; text-align:left; border-bottom:1px solid #eef1f5; }
        .mg-compare thead th { background:#f9fafb; font-size:13px; color:#374151; z-index:1; }
        .mg-compare tbody tr:nth-child(odd) { background:#fcfcfd; }
        .mg-link-btn { display:inline-flex; align-items:center; justify-content:center; padding:8px 12px; border-radius:8px; background:#0070f3; color:#fff; text-decoration:none; font-weight:700; }
        .mg-tag { display:inline-block; background:#e5e7eb; color:#6b7280; padding:4px 8px; border-radius:9999px; font-size:12px; }
        .is-preparing { opacity:.7; }
        .mg-scroll-hint { text-align:center; font-size:12px; color:#6b7280; padding:8px 0; }
      `}</style>
    </div>
  );
}
