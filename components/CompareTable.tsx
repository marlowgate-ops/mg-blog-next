'use client';
import React from 'react';
import PrimaryCta from './PrimaryCta';

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

export default function CompareTable({ rows }: { rows: Row[] }) {
  const allKeys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const core = ['brand'];
  const optional = allKeys.filter(k => !core.includes(k) && k !== 'state' && k !== 'ctaHref');

  return (
    <div className="tableWrap">
      <div className="scroll-hint">横スクロールできます</div>
      <table className="compare-table">
        <thead>
          <tr>
            <th className="stickyColStart stickyHeader">{LABELS.brand}</th>
            {optional.map(key => (
              <th key={key} className="stickyHeader">{LABELS[key] ?? key}</th>
            ))}
            <th className="stickyColEnd stickyHeader">口座開設</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.state === 'preparing' ? 'is-preparing' : ''}>
              <td className="stickyColStart">
                <span className="brand-tag">{r.brand}</span>
              </td>
              {optional.map((key) => (
                <td key={key}>{(r as any)[key] ?? '-'}</td>
              ))}
              <td className="stickyColEnd">
                {r.ctaHref && <PrimaryCta href={r.ctaHref} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <style jsx>{`
        .tableWrap {
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          position: relative;
          overflow: hidden;
        }

        .scroll-hint {
          text-align: center;
          font-size: 12px;
          color: var(--muted);
          padding: 8px 0;
        }

        .compare-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 720px;
        }

        .compare-table th,
        .compare-table td {
          padding: 12px 10px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
        }

        .compare-table tbody tr:nth-child(odd) {
          background: var(--surface);
        }

        .compare-table tbody tr:nth-child(even) {
          background: var(--bg);
        }

        .brand-tag {
          display: inline-block;
          background: #e5f6fb;
          color: #036C7E;
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
        }

        .is-preparing {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}