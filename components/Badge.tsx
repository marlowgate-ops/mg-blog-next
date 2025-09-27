import React from "react";
import s from "./Badge.module.css";

interface BadgeProps {
  badge: string;
  label: string;
  description: string;
  variant?: "primary" | "secondary" | "accent";
}

export default function Badge({ 
  badge, 
  label, 
  description, 
  variant = "primary" 
}: BadgeProps) {
  return (
    <span
      className={`${s.badge} ${s[variant]}`}
      aria-label={`${label}: ${description}`}
      title={description}
      tabIndex={0}
      role="button"
    >
      {label}
    </span>
  );
}