"use client";
import React from "react";
import { Tooltip } from "./ui/Tooltip";
export default function PrRibbon() {
  return (
    <div className="mg-pr-ribbon" aria-live="polite">
      <Tooltip label="当ページには広告が含まれます。推奨・評価の指標は本文をご参照ください。">
        <span aria-label="PR" tabIndex={0}>PR</span>
      </Tooltip>
      <style jsx global>{`
        .mg-pr-ribbon { position: fixed; top: 12px; right: 12px; z-index: 50; }
        .mg-pr-ribbon > span, .mg-pr-ribbon .mg-tooltip-trigger { display:inline-flex; align-items:center; justify-content:center; width:36px; height:24px; font-weight:700; font-size:12px; color:#fff; background:#ff8a00; border-radius:9999px; box-shadow:0 2px 6px rgba(0,0,0,.15); cursor: default; }
        @media (max-width: 640px) { .mg-pr-ribbon { top: 8px; right: 8px; } }
      `}</style>
    </div>
  );
}
