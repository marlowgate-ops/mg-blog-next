"use client";
import React from "react";

interface StickyCTAProps {
  href?: string;
  deadline?: string;
  campaignText?: string;
}

export default function StickyCTA({
  href = "#table",
  deadline,
  campaignText = "公式サイトで口座開設",
}: StickyCTAProps) {
  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = deadline ? getDaysRemaining(deadline) : 0;
  const showDeadline = deadline && daysRemaining > 0;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--surface-card)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        padding: "var(--space-3) var(--space-6)",
        marginBottom: "var(--space-4)",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: "#06b6d4",
            borderRadius: "50%",
          }}
        />
        <span
          style={{
            fontSize: "14px",
            color: "var(--muted)",
            fontWeight: "500",
          }}
        >
          今すぐ口座開設
        </span>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
      >
        {showDeadline && (
          <div
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "var(--space-1) var(--space-2)",
              borderRadius: "var(--space-1)",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            残り{daysRemaining}日
          </div>
        )}

        <a
          href={href}
          style={{
            backgroundColor: "#06b6d4",
            color: "white",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--space-2)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            transition: "background-color 0.2s ease",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0891b2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#06b6d4";
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid #06b6d4";
            e.currentTarget.style.outlineOffset = "2px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
          aria-label={`${campaignText} - 新しいタブで開きます`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {campaignText}
        </a>
      </div>
    </div>
  );
}
