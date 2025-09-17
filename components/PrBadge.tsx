"use client";
import React from "react";
import { Tooltip } from "./ui/Tooltip";
import { PR_PARAGRAPH } from "@/content/disclosure";

/** Hero内右上に置くPRバッジ（非固定）。ツールチップは左側表示で切れを防止 */
export default function PrBadge() {
  return (
    <div className="mg-pr-badge">
      <Tooltip label={PR_PARAGRAPH} side="left">
        <span aria-label="PR" tabIndex={0}>PR</span>
      </Tooltip>
      <style jsx global>{`
        .mg-pr-badge { position:absolute; top:10px; right:10px; z-index:2; }
        .mg-pr-badge > span, .mg-pr-badge .mg-tooltip-trigger{
          display:inline-flex; align-items:center; justify-content:center;
          width:32px; height:22px; border-radius:9999px; font-size:12px; font-weight:700;
          color:#fff; background:#ff8a00;
        }
        @media (max-width: 640px){
          .mg-pr-badge { top:8px; right:8px; }
        }
      `}</style>
    </div>
  );
}
