import React from "react";

type Props = {
  href: string;
  label?: string;
  className?: string;
};
export default function PrimaryCta({ href, label = "公式サイトで口座開設", className }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored"
      aria-label={label}
      className={className ?? "btn-primary-cta"}
    >
      {label}
    </a>
  );
}