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
  const cols = [...core, ...optional];

  return (
    <div className="tableWrap" role="region" aria-label="主要スペック比較表">
      <div className="scroll-hint">横スクロールできます</div>
      <div className="table-container">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="stickyColStart" style={{ minWidth: '220px' }}>
                {LABELS.brand}
              </th>
              {optional.map(key => (
                <th key={key} style={{ minWidth: '160px' }}>
                  {LABELS[key] ?? key}
                </th>
              ))}
              <th className="stickyColEnd" style={{ minWidth: '220px' }}>
                口座開設
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.state === 'preparing' ? 'is-preparing' : ''}>
                <td className="stickyColStart">
                  <div className="brand-cell">
                    <span className="brand-tag">{r.brand}</span>
                  </div>
                </td>
                {optional.map((key, j) => (
                  <td key={j} className="data-cell">
                    {(r as any)[key] ?? '-'}
                  </td>
                ))}
                <td className="stickyColEnd">
                  {r.ctaHref && (
                    <PrimaryCta 
                      href={r.ctaHref} 
                      company={r.brand}
                      variant="compact"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx>{`
        .tableWrap {
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          background: var(--surface-card);
          position: relative;
          overflow: hidden;
        }

        .scroll-hint {
          text-align: center;
          font-size: 12px;
          color: var(--muted);
          padding: var(--space-2) 0;
          background: var(--surface-card);
        }

        .table-container {
          overflow-x: auto;
          scroll-behavior: smooth;
        }

        .compare-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 720px;
        }

        .compare-table th,
        .compare-table td {
          padding: var(--space-3) var(--space-2);
          text-align: left;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
          vertical-align: top;
        }

        .compare-table thead th {
          background: var(--surface-bg);
          font-size: 13px;
          color: var(--muted);
          font-weight: 700;
          position: sticky;
          top: 0;
          z-index: 3;
        }

        .compare-table tbody tr:nth-child(odd) {
          background: var(--surface-card);
        }

        .compare-table tbody tr:nth-child(even) {
          background: var(--surface-bg);
        }

        .compare-table tbody tr:hover td {
          background: var(--hover);
        }

        .stickyColStart,
        .stickyColEnd {
          position: sticky;
          background: var(--surface-card);
          z-index: 2;
        }

        .stickyColStart {
          left: 0;
          border-right: 2px solid var(--border);
        }

        .stickyColEnd {
          right: 0;
          border-left: 2px solid var(--border);
        }

        .brand-cell {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .brand-tag {
          display: inline-block;
          background: #e5f6fb;
          color: #036C7E;
          padding: var(--space-1) var(--space-2);
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
        }

        .data-cell {
          font-size: 14px;
        }

        .is-preparing {
          opacity: 0.7;
        }

        /* Ensure sticky headers stay above sticky columns */
        .compare-table thead .stickyColStart,
        .compare-table thead .stickyColEnd {
          z-index: 4;
          background: var(--surface-bg);
        }

        @media (max-width: 768px) {
          .compare-table th,
          .compare-table td {
            padding: var(--space-2) var(--space-1);
          }

          .stickyColStart,
          .stickyColEnd {
            min-width: 180px !important;
          }
        }
      `}</style>
    </div>
  );
}