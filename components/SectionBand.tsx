import React from "react";

export default function SectionBand({variant="weak", id, children}:{variant?:"weak"|"strong"; id?:string; children:React.ReactNode}) {
  return (
    <section id={id} className={`sectionBand ${variant}`}>
      <div className="container">{children}</div>
    </section>
  );
}