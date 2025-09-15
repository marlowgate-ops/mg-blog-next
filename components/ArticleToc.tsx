// components/ArticleToc.tsx — 新規追加（簡易目次：クライアント側でh2/h3を収集）
"use client";
import { useEffect, useState } from "react";

type Item = { id: string; text: string; level: number };

export default function ArticleToc() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("article h2, article h3"));
    const mapped = nodes.map((n) => ({
      id: n.id || (n.textContent || "").toLowerCase().replace(/[^a-z0-9一-龥ぁ-んァ-ヶー]+/g, "-"),
      text: n.textContent || "",
      level: n.tagName === "H2" ? 2 : 3,
    }));
    mapped.forEach((m, i) => {
      const el = nodes[i] as HTMLElement;
      if (el && !el.id) el.id = m.id;
    });
    setItems(mapped);
  }, []);
  if (items.length === 0) return null;
  return (
    <nav className="toc" aria-label="目次">
      <strong>Contents</strong>
      <ul>
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "lvl3" : ""}>
            <a href={`#${it.id}`}>{it.text}</a>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .toc { border:1px solid #e5e7eb; border-radius:12px; padding:12px; background:#fff; margin: 16px 0; }
        ul { list-style:none; padding:0; margin: 8px 0 0; }
        li { margin: 6px 0; }
        .lvl3 { padding-left: 10px; opacity: .9; }
        a { text-decoration:none }
      `}</style>
    </nav>
  );
}
