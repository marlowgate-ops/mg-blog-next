import React from "react";
import s from "@/app/best/layout.module.css";

export default function SectionBand({
  variant = "subtle",
  id,
  children,
}: {
  variant?: "subtle" | "strong" | "accent" | "weak";
  id?: string;
  children: React.ReactNode;
}) {
  // Map variants to existing CSS classes
  const variantClass =
    variant === "strong" 
      ? s.strong 
      : variant === "accent" 
        ? s.accent 
        : variant === "weak"
          ? s.weak
          : s.subtle; // Default for 'subtle'

  return (
    <section id={id} className={`${s.sectionBand} ${variantClass}`}>
      <div className={s.container}>{children}</div>
    </section>
  );
}
