"use client";
import React from "react";
import { PR_PARAGRAPH } from "@/content/disclosure";

export default function DisclosureParagraph() {
  return (
    <p className="mg-disclosure" role="note">
      {PR_PARAGRAPH}
      <style jsx>{`
        .mg-disclosure{
          margin: 10px 0 18px;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid #e7e8ea;
          border-radius: 8px;
          color: #374151;
          font-size: 12px;
          line-height: 1.7;
        }
      `}</style>
    </p>
  );
}
