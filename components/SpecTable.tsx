"use client";
import React from "react";
import styles from "./SpecTable.module.css";
import type { Broker } from "../data/brokers";
import AffCta from "./aff/AffCta";

export default function SpecTable({ rows }: { rows: Broker[] }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.h2}>主要スペック比較</h2>
      <div className={styles.scrollHint}>横にスクロールできます</div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>業者</th>
              <th>口座/商品</th>
              <th>プラットフォーム</th>
              <th>コスト</th>
              <th>備考</th>
              <th>口座開設</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b)=>(
              <tr key={b.id} className={b.status !== "active" ? styles.inactive : undefined}>
                <td>{b.name}</td>
                <td>FX</td>
                <td>Web / アプリ</td>
                <td>—</td>
                <td>—</td>
                <td><AffCta broker={b} disabled={b.status!=="active"} placement="spec-table" size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
