"use client";
import React from "react";
import styles from "./AffCta.module.css";
import type { Broker } from "../../data/brokers";

function gtagEvent(name: string, params: Record<string, any>) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", name, params);
    }
  } catch {}
}

export default function AffCta({
  broker,
  placement,
  disabled,
  size = "md",
}: {
  broker: Broker;
  placement: "rank-card" | "spec-table";
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const href = process.env.NEXT_PUBLIC_RUNTIME_ENV === "dev"
    ? broker.site
    : (process.env[broker.ctaEnv as any] || broker.site);
  const label = disabled ? "準備中" : "公式サイトで口座開設";

  const onClick = () => {
    if (disabled) return;
    gtagEvent("affiliate_click", {
      brand: broker.id,
      page_type: "best",
      placement,
      variant: process.env.NEXT_PUBLIC_COPY_VARIANT || "A",
      link_domain: href ? new URL(href).hostname : "",
    });
  };

  return (
    <a
      className={`${styles.btn} ${size==="sm" ? styles.sm : ""} ${disabled?styles.disabled:""}`}
      href={href || "#"}
      target="_blank"
      rel="sponsored noopener nofollow"
      aria-disabled={disabled}
      onClick={onClick}
    >
      {label}
    </a>
  );
}
