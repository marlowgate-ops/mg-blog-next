"use client";
import React from "react";
export default function Container({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={["mg-container", className].filter(Boolean).join(" ")}>
      {children}
      <style jsx global>{`
        .mg-container { max-width: 1180px; margin: 0 auto; padding: 0 16px; }
        @media (min-width: 1600px) { .mg-container { max-width: 1280px; } }
      `}</style>
    </div>
  );
}
