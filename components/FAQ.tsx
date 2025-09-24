"use client";
import React from "react";
import styles from "./Faq.module.css";

type QA = { q: string; a: string };
export default function Faq({ items }: { items: QA[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section className={styles.wrap} aria-label="よくある質問">
      <h2 className={styles.h2}>よくある質問</h2>
      <ul className={styles.list}>
        {items.map((x, i) => (
          <li key={i} className={styles.item}>
            <button className={styles.q} onClick={()=> setOpen(open===i?null:i)} aria-expanded={open===i}>
              {x.q}
            </button>
            {open===i && <div className={styles.a}>{x.a}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}
