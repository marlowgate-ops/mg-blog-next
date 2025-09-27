import React, { useState } from "react";
import Badge from "./Badge";
import s from "./BadgeOverflow.module.css";

interface BadgeItem {
  key: string;
  label: string;
  description: string;
}

interface BadgeOverflowProps {
  badges: BadgeItem[];
  maxVisible?: number;
  variant?: "primary" | "secondary" | "accent";
}

export default function BadgeOverflow({ 
  badges, 
  maxVisible = 3, 
  variant = "primary" 
}: BadgeOverflowProps) {
  const [showAll, setShowAll] = useState(false);
  
  if (badges.length === 0) return null;
  
  const visibleBadges = showAll ? badges : badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;
  const hasOverflow = remainingCount > 0;

  // Create descriptive aria-label for the badge group
  const topMetrics = badges.slice(0, Math.min(3, badges.length))
    .map(badge => badge.label)
    .join('、');
  const groupAriaLabel = badges.length > 3 
    ? `評価項目: ${topMetrics}、他${badges.length - 3}項目`
    : `評価項目: ${topMetrics}`;

  return (
    <div 
      className={s.badgeOverflow}
      role="group"
      aria-label={groupAriaLabel}
    >
      {visibleBadges.map((badge) => (
        <Badge
          key={badge.key}
          badge={badge.key}
          label={badge.label}
          description={badge.description}
          variant={variant}
        />
      ))}
      
      {hasOverflow && !showAll && (
        <button
          className={`${s.overflowToggle} ${s[variant]}`}
          onClick={() => setShowAll(true)}
          title={`残り${remainingCount}個のバッジを表示`}
          aria-label={`残り${remainingCount}個のバッジを表示`}
        >
          +{remainingCount}
        </button>
      )}
      
      {showAll && hasOverflow && (
        <button
          className={`${s.collapseToggle} ${s[variant]}`}
          onClick={() => setShowAll(false)}
          title="バッジを折りたたむ"
          aria-label="バッジを折りたたむ"
        >
          −
        </button>
      )}
    </div>
  );
}