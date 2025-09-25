import React from "react";
import s from "@/app/best/layout.module.css";

export default function SectionBand({variant="weak", id, children}:{variant?:"weak"|"strong"|"accent"; id?:string; children:React.ReactNode}) {
  const variantClass = variant === "strong" ? s.strong : variant === "accent" ? s.accent : s.weak;
  
  return (
    <section id={id} className={`${s.sectionBand} ${variantClass}`}>
      <div className={s.container}>{children}</div>
    </section>
  );
}