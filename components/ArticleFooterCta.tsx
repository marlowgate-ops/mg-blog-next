// components/ArticleFooterCta.tsx — 互換版（既存 getCopy API を使用）
"use client";
import Link from "next/link";
import { getCopy } from "@/lib/copy";

export default function ArticleFooterCta() {
  const CP = getCopy(); // { hero, post } 構成
  const title = process.env.NEXT_PUBLIC_CTA_TITLE || CP.post.title;
  const body = process.env.NEXT_PUBLIC_CTA_DESC || CP.post.desc;
  const items = (process.env.NEXT_PUBLIC_CTA_BENEFITS || CP.post.benefits.join("｜")).split(/[|｜]/).filter(Boolean);
  const href = process.env.NEXT_PUBLIC_CTA_URL || CP.post.href;
  const label = process.env.NEXT_PUBLIC_CTA_LABEL || CP.post.label;

  return (
    <aside className="cta">
      <div className="row">
        <div>
          <h4>{title}</h4>
          <p className="desc">{body}</p>
          {items.length ? (
            <ul className="list">
              {items.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          ) : null}
        </div>
        <div className="action">
          <Link href={href} className="btn">{label}</Link>
        </div>
      </div>
      <style jsx>{`
        .cta { margin: 32px 0; padding: 18px; border:1px dashed #999; border-radius:14px; background:#fafafa }
        .row { display:flex; gap:16px; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; }
        h4 { margin:0 0 6px; }
        .desc { margin:0 0 10px; color:#444; }
        .list { margin: 6px 0 0 1em; padding-left: 0; }
        .list li { margin:2px 0; }
        .btn { display:inline-block; margin-top:10px; border:1px solid #222; padding:8px 12px; border-radius:10px; text-decoration:none }
      `}</style>
    </aside>
  );
}
