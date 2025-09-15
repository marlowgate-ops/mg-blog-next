// components/ArticleFooterCta.tsx — 新規追加（記事末尾CTA／A/B切替）
"use client";
import { CTA } from "@/lib/copy";

export default function ArticleFooterCta() {
  const v = process.env.NEXT_PUBLIC_COPY_VARIANT === "B" ? "B" : "A";
  const text = v === "B" ? CTA.B : CTA.A;
  return (
    <aside className="cta">
      <h4>{text.title}</h4>
      <p>{text.body}</p>
      <a className="btn" href={text.href}>{text.button}</a>
      <style jsx>{`
        .cta { margin: 32px 0; padding: 18px; border:1px dashed #999; border-radius:14px; background:#fafafa }
        h4 { margin:0 0 6px; }
        .btn { display:inline-block; margin-top:10px; border:1px solid #222; padding:8px 12px; border-radius:10px; text-decoration:none }
      `}</style>
    </aside>
  );
}
