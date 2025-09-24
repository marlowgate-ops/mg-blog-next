'use client';
import React, { useState, useMemo } from 'react';
import PrimaryCta from './PrimaryCta';
import s from '../app/best/layout.module.css';

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

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

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

// Columns that can be sorted (excluding brand and CTA column)
const SORTABLE_COLUMNS = ['product', 'cost', 'minUnit', 'accountFee', 'appScore'];

export default function CompareTable({ rows }: { rows: Row[] }) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  const allKeys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const core = ['brand'];
  const optional = allKeys.filter(k => !core.includes(k) && k !== 'state' && k !== 'ctaHref');

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    return [...rows].sort((a, b) => {
      const aVal = (a as any)[sortConfig.key] || '';
      const bVal = (b as any)[sortConfig.key] || '';
      
      // Simple string comparison for now
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const handleSort = (key: string) => {
    if (!SORTABLE_COLUMNS.includes(key)) return;
    
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null; // Reset to original order
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, key: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSort(key);
    }
  };

  const getSortState = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction;
  };

  return (
    <div className={s.tableWrap}>
      <div className={s.scrollHint}>横スクロールできます</div>
      <table className={s.compareTable}>
        <thead>
          <tr>
            <th className={`${s.stickyColStart} ${s.stickyHeader}`}>{LABELS.brand}</th>
            {optional.map(key => {
              const isSortable = SORTABLE_COLUMNS.includes(key);
              const sortState = getSortState(key);
              
              return (
                <th 
                  key={key} 
                  className={`${s.stickyHeader} ${isSortable ? s.sortable : ''}`}
                  {...(isSortable ? {
                    role: 'button',
                    tabIndex: 0,
                    onClick: () => handleSort(key),
                    onKeyDown: (e) => handleKeyDown(e, key),
                    'aria-sort': sortState ? (sortState === 'asc' ? 'ascending' : 'descending') : 'none',
                    'data-sort': sortState || undefined
                  } : {})}
                >
                  {LABELS[key] ?? key}
                </th>
              );
            })}
            <th className={`${s.stickyColEnd} ${s.stickyHeader}`}>口座開設</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((r, i) => (
            <tr key={i} className={r.state === 'preparing' ? s.isPreparing : ''}>
              <td className={s.stickyColStart}>
                <span className={s.brandTag}>{r.brand}</span>
              </td>
              {optional.map((key) => (
                <td key={key}>{(r as any)[key] ?? '-'}</td>
              ))}
              <td className={s.stickyColEnd}>
                {r.ctaHref && <PrimaryCta href={r.ctaHref} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}