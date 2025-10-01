"use client";
import React, { useState, useMemo } from "react";
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

const FILTER_CHIPS = [
  { id: "beginner", label: "初心者向け", tag: "初心者向け" },
  { id: "low-spread", label: "低スプレッド", tag: "低スプレッド" },
  { id: "mt4", label: "MT4対応", tag: "MT4対応" },
  { id: "major-bank", label: "大手証券系", tag: "大手証券系" },
  { id: "high-rated", label: "高評価", tag: "高評価" },
];

export default function CompareTable({ rows }: { rows: Row[] }) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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

    // Then sort
    if (!sortConfig) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aVal = (a as any)[sortConfig.key] || "";
      const bVal = (b as any)[sortConfig.key] || "";

      // Simple string comparison for now
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig, activeFilters]);

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
              className={r.state === "preparing" ? s.isPreparing : ""}
            >
              <td className={s.stickyColStart}>
                <div className={s.brandCell}>
                  <span className={s.brandTag}>{r.brand}</span>
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
                </div>
              </td>
              {optional.map((key) => (
                <td key={key}>{(r as any)[key] ?? "-"}</td>
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
