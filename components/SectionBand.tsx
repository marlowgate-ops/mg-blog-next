import React from "react";
import s from "@/app/best/layout.module.css";

export default function SectionBand({variant="weak", id, children}:{variant?:"weak"|"strong"; id?:string; children:React.ReactNode}) {
  return (
    <section id={id} className={`${s.sectionBand} ${variant==="strong" ? s.strong : s.weak}`}>
      <div className={s.container}>{children}</div>
    </section>
  );
}