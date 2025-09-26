import React from "react";
import SectionBand from "./SectionBand";
import s from "@/app/best/layout.module.css";

interface BandSectionProps {
  id: string;
  title?: string;
  variant?: 'subtle' | 'strong' | 'weak' | 'accent';
  children: React.ReactNode;
}

export default function BandSection({ id, title, variant, children }: BandSectionProps) {
  return (
    <SectionBand variant={variant} id={id}>
      <div className={s.container}>
        {title && (
          <h2 className={s.sectionTitle}>
            <span className={s.bar} />
            {title}
          </h2>
        )}
        {children}
      </div>
    </SectionBand>
  );
}