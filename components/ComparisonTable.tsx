'use client';
import React from 'react';

type Row = {
  brand: string;
  product?: string;
  platform?: string;
  cost?: string;
  minUnit?: string;
  accountFee?: string;
  depositWithdraw?: string;
  api?: string;
  tools?: string;
  appScore?: string;
  support?: string;
  note?: string;
  state?: 'active' | 'preparing';
  ctaHref?: string;
};

const LABELS: Record<string,string> = {
  brand:'会社',
  product:'商品',
  platform:'プラットフォーム',
  cost:'総コスト',
  minUnit:'最低通貨単位',
  accountFee:'口座維持費',
  depositWithdraw:'入出金',
  api:'API',
  tools:'ツール',
  appScore:'アプリ',
  support:'サポート',
  note:'備考'
};

export default function ComparisonTable({ rows }: { rows: Row[] }) {
  const allKeys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const core = ['brand'];
  const optional = allKeys.filter(k => !core.includes(k) && k !== 'state' && k !== 'ctaHref');
  const cols = [...core, ...optional];

  return (
    <div className="mg-table-wrap" role="region" aria-label="主要スペック比較表">
      <div className="mg-scroll-hint">横スクロールできます</div>
      <div className="mg-table">
        <table className="mg-compare">
          <thead>
            <tr>
              {cols.map(key => <th key={key}>{LABELS[key] ?? key}</th>)}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.state === 'preparing' ? 'is-preparing' : ''}>
                {cols.map((key, j) => (
                  <td key={j} className={key==='brand' ? 'col-name' : ''}>
                    {key==='brand' ? <span className="mg-tag">{r.brand}</span> : (r as any)[key] ?? '-'}
                  </td>
                ))}
                <td>
                  {r.ctaHref && <a className="mg-link-btn" href={r.ctaHref}>公式へ</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .mg-table-wrap { border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
        .mg-table { overflow:auto; }
        .mg-compare { width:100%; border-collapse:separate; border-spacing:0; min-width:720px; }
        .mg-compare th, .mg-compare td { padding:12px 10px; text-align:left; border-bottom:1px solid #eef1f5; }
        .mg-compare thead th { background:#f9fafb; font-size:13px; color:#374151; position:sticky; top:0; z-index:2; }
        .mg-compare tbody tr:nth-child(odd) { background:#fcfcfd; }
        .mg-compare tbody tr:hover td { background:#fafafa; }
        .col-name { position: sticky; left: 0; z-index: 3; background:#fff; font-weight:700; }
        .mg-link-btn { display:inline-flex; align-items:center; gap:6px; background:#06b6d4; color:#fff; padding:8px 12px; border-radius:10px; text-decoration:none; font-weight:700; }
        .mg-link-btn:hover { opacity:.92; }
        .mg-tag { display:inline-block; background:#e5f6fb; color:#036C7E; padding:4px 8px; border-radius:9999px; font-size:12px; font-weight:700; }
        .is-preparing { opacity:.7; }
        .mg-scroll-hint { text-align:center; font-size:12px; color:#6b7280; padding:8px 0; }
      `}</style>
    </div>
  );
}
