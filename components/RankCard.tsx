"use client";
import React from "react";
import styles from "./RankCard.module.css";
import type { Broker } from "../data/brokers";
import AffCta from "./aff/AffCta";

function Meter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value/5)*100)));
  return (
    <div className={styles.meter} aria-label={`スコア ${value} / 5`}>
      <div className={styles.meterBar} style={{ width: pct + "%" }} />
    </div>
  );
}

export default function RankCard({ rank, broker }: { rank: number; broker: Broker }) {
  const disabled = broker.status !== "active";
  return (
    <article className={styles.card} aria-disabled={disabled}>
      <div className={styles.header}>
        <div className={styles.rank}>{rank}</div>
        <h3 className={styles.name}>
          {broker.name}{" "}
          {broker.status === "preparing" && <span className={styles.badge}>準備中</span>}
        </h3>
      </div>
      <div className={styles.row}>
        <div className={styles.score}>
          <Meter value={broker.score} />
          <div className={styles.scoreText}>
            {broker.score.toFixed(1)} <span>/ 5</span>
          </div>
        </div>
        <ul className={styles.pros}>
          {broker.pros.slice(0,2).map((p,i)=>(<li key={i}>・{p}</li>))}
        </ul>
        <ul className={styles.cons}>
          {broker.cons.slice(0,2).map((c,i)=>(<li key={i}>・{c}</li>))}
        </ul>
      </div>
      <div className={styles.ctaRow}>
        <AffCta broker={broker} disabled={disabled} placement="rank-card" />
      </div>
    </article>
  );
}
