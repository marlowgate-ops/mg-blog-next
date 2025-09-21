import React from "react";
import s from "./layout.module.css";
export const metadata = { alternates: {} };
export default function BestLayout({ children }: { children: React.ReactNode }) {
  return <div className={s.page}>{children}</div>;
}
