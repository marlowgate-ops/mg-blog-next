"use client";
import React, { useId, useState } from "react";
type Props = { label: React.ReactNode; children: React.ReactNode; side?: "top" | "right" | "bottom" | "left"; };
export function Tooltip({ label, children, side = "bottom" }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className="mg-tooltip-wrapper" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span aria-describedby={id} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} className="mg-tooltip-trigger">
        {children}
      </span>
      <span role="tooltip" id={id} className={`mg-tooltip mg-tooltip-${side}`} aria-hidden={open ? "false" : "true"} style={{ opacity: open ? 1 : 0, pointerEvents: "none" }}>
        {label}
      </span>
      <style jsx global>{`
        .mg-tooltip-wrapper { position: relative; display: inline-block; }
        .mg-tooltip { position: absolute; background: rgba(0,0,0,.8); color:#fff; font-size:12px; line-height:1.4; padding:6px 8px; border-radius:4px; white-space:normal; max-width: 360px; transition: opacity .15s ease; z-index:30; }
        .mg-tooltip-bottom { top:100%; left:50%; transform:translateX(-50%); margin-top:8px; }
        .mg-tooltip-top { bottom:100%; left:50%; transform:translateX(-50%); margin-bottom:8px; }
        .mg-tooltip-left { right:100%; top:50%; transform:translateY(-50%); margin-right:8px; }
        .mg-tooltip-right { left:100%; top:50%; transform:translateY(-50%); margin-left:8px; }
      `}</style>
    </span>
  );
}
