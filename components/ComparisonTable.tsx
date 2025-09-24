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
  const [showLeftGradient, setShowLeftGradient] = React.useState(false);
  const [showRightGradient, setShowRightGradient] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const allKeys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
  const core = ['brand'];
  const optional = allKeys.filter(k => !core.includes(k) && k !== 'state' && k !== 'ctaHref');
  const cols = [...core, ...optional];

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    
    setShowLeftGradient(scrollLeft > 10);
    setShowRightGradient(scrollLeft < maxScroll - 10);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    el.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();
    
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="mg-table-wrap" role="region" aria-label="主要スペック比較表">
      <div className="mg-scroll-hint">横スクロールできます</div>
      <div 
        className={`mg-table ${showLeftGradient ? 'show-left-gradient' : ''} ${showRightGradient ? 'show-right-gradient' : ''}`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <table className="mg-compare">
          <thead>
            <tr>
              {cols.map(key => (
                <th key={key} className={key === 'brand' ? 'col-brand-header' : ''}>
                  {LABELS[key] ?? key}
                </th>
              ))}
              <th className="col-cta-header"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.state === 'preparing' ? 'is-preparing' : ''}>
                {cols.map((key, j) => (
                  <td key={j} className={key==='brand' ? 'col-brand' : ''}>
                    {key==='brand' ? <span className="mg-tag">{r.brand}</span> : (r as any)[key] ?? '-'}
                  </td>
                ))}
                <td className="col-cta">
                  {r.ctaHref && <a className="mg-link-btn" href={r.ctaHref}>公式へ</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="gradient-left"></div>
        <div className="gradient-right"></div>
      </div>
      <style jsx>{`
        .mg-table-wrap { 
          border: 1px solid #e5e7eb; 
          border-radius: 12px; 
          background: #fff; 
          position: relative;
          overflow: hidden;
        }
        .mg-table { 
          overflow: auto; 
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .mg-table::-webkit-scrollbar {
          height: 8px;
        }
        .mg-table::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .mg-table::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .mg-table::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .mg-compare { 
          width: 100%; 
          border-collapse: separate; 
          border-spacing: 0; 
          min-width: 720px; 
        }
        
        .mg-compare th, .mg-compare td { 
          padding: 12px 10px; 
          text-align: left; 
          border-bottom: 1px solid #eef1f5;
          white-space: nowrap;
        }
        
        .mg-compare thead th { 
          background: #f9fafb; 
          font-size: 13px; 
          color: #374151; 
          position: sticky; 
          top: 0; 
          z-index: 4;
          border-right: 1px solid #e5e7eb;
        }
        
        .mg-compare tbody tr:nth-child(odd) { background: #fcfcfd; }
        .mg-compare tbody tr:hover td { background: #fafafa; }
        
        .col-brand-header, .col-brand { 
          position: sticky; 
          left: 0; 
          z-index: 3; 
          background: #fff;
          border-right: 2px solid #e5e7eb;
        }
        
        .col-brand-header {
          background: #f9fafb;
          z-index: 5;
        }
        
        .col-brand { 
          font-weight: 700;
        }
        
        .col-cta-header, .col-cta {
          position: sticky;
          right: 0;
          z-index: 3;
          background: #fff;
          border-left: 2px solid #e5e7eb;
          min-width: 100px;
        }
        
        .col-cta-header {
          background: #f9fafb;
          z-index: 5;
        }
        
        .mg-link-btn { 
          display: inline-flex; 
          align-items: center; 
          gap: 6px; 
          background: #06b6d4; 
          color: #fff; 
          padding: 8px 12px; 
          border-radius: 10px; 
          text-decoration: none; 
          font-weight: 700;
          font-size: 12px;
          white-space: nowrap;
        }
        .mg-link-btn:hover { opacity: .92; }
        
        .mg-tag { 
          display: inline-block; 
          background: #e5f6fb; 
          color: #036C7E; 
          padding: 4px 8px; 
          border-radius: 9999px; 
          font-size: 12px; 
          font-weight: 700; 
        }
        
        .is-preparing { opacity: .7; }
        
        .mg-scroll-hint { 
          text-align: center; 
          font-size: 12px; 
          color: #6b7280; 
          padding: 8px 0; 
        }
        
        .gradient-left, .gradient-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 20px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .gradient-left {
          left: 0;
          background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
        }
        
        .gradient-right {
          right: 0;
          background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
        }
        
        .show-left-gradient .gradient-left {
          opacity: 1;
        }
        
        .show-right-gradient .gradient-right {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
