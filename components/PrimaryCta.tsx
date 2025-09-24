import React from "react";

interface PrimaryCtaProps {
  href: string;
  company: string;
  variant?: "default" | "compact";
  className?: string;
}

export default function PrimaryCta({ 
  href, 
  company, 
  variant = "default", 
  className = "" 
}: PrimaryCtaProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow sponsored"
      className={`mg-primary-cta mg-primary-cta--${variant} ${className}`.trim()}
      data-company={company}
    >
      公式サイトで口座開設
    </a>
  );
}