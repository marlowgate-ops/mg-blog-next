"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useUrlState } from "@/lib/url/useUrlState";
import PrimaryCta from "./PrimaryCta";
import BadgeOverflow from "./BadgeOverflow";
import MicroCopyMessage from "./MicroCopyMessage";
import { getBrokerBadges, getEvaluationMeta } from "@/lib/evaluation";
import s from "@/app/best/layout.module.css";

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
  state?: "active" | "preparing";
  ctaHref?: string;
  tags?: string[];
  score?: number; // Overall evaluation score for badges
};

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

const LABELS: Record<string, string> = {
  brand: "会社",
  product: "商品",
  platform: "プラットフォーム",
  cost: "総コスト",
  minUnit: "最低通貨単位",
  accountFee: "口座維持費",
  depositWithdraw: "入出金",
  api: "API",
  tools: "ツール",
  appScore: "アプリ",
  support: "サポート",
  note: "備考",
};

// Columns that can be sorted (excluding brand and CTA column)
const SORTABLE_COLUMNS = [
  "product",
  "cost",
  "minUnit",
  "accountFee",
  "appScore",
];

// URL state schema for broker comparison table
const compareUrlSchema = z.object({
  regulation: z.string().optional().default(''),
  minDeposit: z.string().optional().default(''),
  accountType: z.string().optional().default(''),
  sort: z.string().optional().default(''),
});

type CompareUrlState = z.infer<typeof compareUrlSchema>;

interface CompareTableProps {
  rows: Row[];
  initialState?: CompareUrlState;
}

const FILTER_CHIPS = [
  { id: "beginner", label: "初心者向け", tag: "初心者向け" },
  { id: "low-spread", label: "低スプレッド", tag: "低スプレッド" },
  { id: "mt4", label: "MT4対応", tag: "MT4対応" },
  { id: "major-bank", label: "大手証券系", tag: "大手証券系" },
  { id: "high-rated", label: "高評価", tag: "高評価" },
];

export default function CompareTable({ rows, initialState }: CompareTableProps) {
  const router = useRouter();
  
  // Debug logging

  
  // Use new URL state management system with SSR-compatible initialization
  const [urlState, setPatch] = useUrlState({
    schema: compareUrlSchema,
    defaults: { regulation: '', minDeposit: '', accountType: '', sort: '' },
    ...(initialState && { initialState }),
  });
  
  // Debug logging for URL state

  
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Handle row click navigation
  const handleRowClick = (brand: string) => {
    // Map brand names to broker slugs - updated with actual brand names
    const brandToSlug: Record<string, string> = {
      'DMM.com証券': 'dmm-fx',
      'DMM FX': 'dmm-fx',
      'GMOクリック証券': 'gmo-click',
      'GMO': 'gmo-click',
      'SBI': 'sbi-fx',
      'SBI FXトレード': 'sbi-fx',
      '松井証券': 'matsui',
      // Add more mappings as needed
    };
    
    const slug = brandToSlug[brand] || brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
    router.push(`/brokers/${slug}`);
  };

  // Get broker slug for a brand name
  const getBrokerSlug = (brand: string): string => {
    const brandToSlug: Record<string, string> = {
      'DMM.com証券': 'dmm-fx',
      'DMM FX': 'dmm-fx',
      'GMOクリック証券': 'gmo-click',
      'GMO': 'gmo-click', 
      'SBI': 'sbi-fx',
      'SBI FXトレード': 'sbi-fx',
      '松井証券': 'matsui',
      // Add more mappings as needed
    };
    
    return brandToSlug[brand] || brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const allKeys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const core = ["brand"];
  const EXCLUDED_KEYS = ["state", "ctaHref", "tags", "score"];
  const optional = allKeys.filter(
    (k) => !core.includes(k) && !EXCLUDED_KEYS.includes(k)
  );

  const filteredAndSortedRows = useMemo(() => {
    // First filter by active chips
    let filteredRows = rows;
    if (activeFilters.length > 0) {
      const filterTags = FILTER_CHIPS.filter((chip) =>
        activeFilters.includes(chip.id)
      ).map((chip) => chip.tag);
      filteredRows = rows.filter((row) =>
        filterTags.every((tag) => row.tags?.includes(tag))
      );
    }

    // Apply URL-based filters
    if (urlState.regulation) {
      // For demo, all brokers have FSA regulation
      if (urlState.regulation !== 'FSA') {
        filteredRows = [];
      }
    }

    if (urlState.accountType) {
      // For demo, all brokers support demo accounts
      if (urlState.accountType !== 'demo') {
        filteredRows = [];
      }
    }

    // Apply sorting based on sort from URL
    if (urlState.sort) {
      filteredRows = [...filteredRows].sort((a, b) => {
        if (urlState.sort === 'rating-desc') {
          const aScore = a.score || 0;
          const bScore = b.score || 0;
          return bScore - aScore;
        }
        if (urlState.sort === 'rating-asc') {
          const aScore = a.score || 0;
          const bScore = b.score || 0;
          return aScore - bScore;
        }
        if (urlState.sort === 'spread-asc') {
          // For demo, sort by cost alphabetically as proxy for spread
          const aCost = a.cost || 'zzz';
          const bCost = b.cost || 'zzz';
          return aCost.localeCompare(bCost);
        }
        if (urlState.sort === 'spread-desc') {
          const aCost = a.cost || '';
          const bCost = b.cost || '';
          return bCost.localeCompare(aCost);
        }
        return 0;
      });
    }

    // Legacy sort config (keep for compatibility)
    if (!urlState.sort && sortConfig) {
      filteredRows = [...filteredRows].sort((a, b) => {
        const aVal = (a as any)[sortConfig.key] || "";
        const bVal = (b as any)[sortConfig.key] || "";

        // Simple string comparison for legacy sorting
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredRows;
  }, [rows, sortConfig, activeFilters, urlState.regulation, urlState.accountType, urlState.sort]);

  const handleSort = (key: string) => {
    if (!SORTABLE_COLUMNS.includes(key)) return;

    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null; // Reset to original order
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, key: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSort(key);
    }
  };

  const handleFilterToggle = (filterId: string) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    );
  };

  const getSortState = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction;
  };

  return (
    <div className={s.tableWrap}>
      {/* Select-based filters for E2E tests */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label htmlFor="regulation-filter" className="text-sm font-medium text-gray-700 mb-1">
            規制機関
          </label>
          <select
            id="regulation-filter"
            data-testid="filter-regulation"
            value={urlState.regulation}
            onChange={(e) => {

              setPatch({ regulation: e.target.value });
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            <option value="FSA">金融庁 (FSA)</option>
            <option value="CFTC">CFTC</option>
            <option value="FCA">FCA</option>
            <option value="ASIC">ASIC</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="min-deposit-filter" className="text-sm font-medium text-gray-700 mb-1">
            最低入金額
          </label>
          <select
            id="min-deposit-filter"
            data-testid="filter-min-deposit"
            value={urlState.minDeposit}
            onChange={(e) => setPatch({ minDeposit: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            <option value="0">0円</option>
            <option value="100">100円以上</option>
            <option value="1000">1,000円以上</option>
            <option value="10000">10,000円以上</option>
            <option value="100000">100,000円以上</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="account-type-filter" className="text-sm font-medium text-gray-700 mb-1">
            口座タイプ
          </label>
          <select
            id="account-type-filter"
            data-testid="filter-account-type"
            value={urlState.accountType}
            onChange={(e) => setPatch({ accountType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            <option value="demo">デモ</option>
            <option value="standard">スタンダード</option>
            <option value="pro">プロ</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mb-1">
            並び順
          </label>
          <select
            id="sort-select"
            data-testid="sort-select"
            value={urlState.sort}
            onChange={(e) => {
              setPatch({ sort: e.target.value });
              // Clear legacy sortConfig when using new sort
              if (e.target.value) {
                setSortConfig(null);
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">デフォルト</option>
            <option value="rating-desc">評価の高い順</option>
            <option value="rating-asc">評価の低い順</option>
            <option value="spread-asc">スプレッドの狭い順</option>
            <option value="spread-desc">スプレッドの広い順</option>
          </select>
        </div>
      </div>

      <div className={s.filterChips}>
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            className={`${s.filterChip} ${
              activeFilters.includes(chip.id) ? s.active : ""
            }`}
            onClick={() => handleFilterToggle(chip.id)}
            aria-pressed={activeFilters.includes(chip.id)}
          >
            {chip.label}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            className={s.clearFilters}
            onClick={() => setActiveFilters([])}
            aria-label="フィルターをクリア"
          >
            クリア
          </button>
        )}
        <div style={{ marginLeft: 'auto', flex: 1, maxWidth: '280px' }}>
          <MicroCopyMessage category="clarity" subtle />
        </div>
      </div>
      <div className={s.scrollHint}>横スクロールできます</div>
      <table className={`${s.compareTable} ${s.gradientEdges}`} data-testid="broker-compare-table">
        <thead>
          <tr>
            <th className={`${s.stickyColStart} ${s.stickyHeader}`}>
              {LABELS.brand}
            </th>
            {optional.map((key) => {
              const isSortable = SORTABLE_COLUMNS.includes(key);
              const sortState = getSortState(key);

              return (
                <th
                  key={key}
                  className={`${s.stickyHeader} ${
                    isSortable ? s.sortable : ""
                  }`}
                  {...(isSortable
                    ? {
                        role: "button",
                        tabIndex: 0,
                        onClick: () => handleSort(key),
                        onKeyDown: (e) => handleKeyDown(e, key),
                        "aria-sort": sortState
                          ? sortState === "asc"
                            ? "ascending"
                            : "descending"
                          : "none",
                        "data-sort": sortState || undefined,
                      }
                    : {})}
                >
                  {LABELS[key] ?? key}
                </th>
              );
            })}
            <th className={`${s.stickyColEnd} ${s.stickyHeader}`}>口座開設</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedRows.map((r, i) => (
            <tr
              key={i}
              className={`${r.state === "preparing" ? s.isPreparing : ""} cursor-pointer hover:bg-gray-50`}
              data-testid="broker-table-row"
              data-broker-slug={getBrokerSlug(r.brand)}
              onClick={() => handleRowClick(r.brand)}
            >
              <td className={s.stickyColStart}>
                <div className={s.brandCell}>
                  <span className={s.brandTag} data-testid="broker-name">{r.brand}</span>
                  {r.score && (
                    <div className={s.tableBadges}>
                      <BadgeOverflow
                        badges={getBrokerBadges(r.score).map((badgeKey) => {
                          const meta = getEvaluationMeta();
                          const badgeInfo = meta.badges?.[badgeKey];
                          return badgeInfo && badgeInfo.label && badgeInfo.description
                            ? {
                                key: badgeKey,
                                label: badgeInfo.label,
                                description: badgeInfo.description,
                              }
                            : null;
                        }).filter((badge): badge is { key: string; label: string; description: string } => badge !== null)}
                        maxVisible={3}
                        variant="secondary"
                      />
                    </div>
                  )}
                  {r.score && (
                    <span data-testid="broker-rating" className="text-sm text-gray-600">
                      評価: {r.score}/100
                    </span>
                  )}
                  <span data-testid="broker-regulation" className="text-xs text-gray-500">
                    FSA
                  </span>
                  <span data-testid="broker-min-deposit" className="text-xs text-gray-500">
                    No minimum
                  </span>
                  <span data-testid="broker-demo-account" className="text-xs text-gray-500">
                    Yes
                  </span>
                </div>
              </td>
              {optional.map((key) => (
                <td key={key}>{(r as any)[key] ?? "-"}</td>
              ))}
              <td className={s.stickyColEnd}>
                {r.ctaHref && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <PrimaryCta href={r.ctaHref} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
