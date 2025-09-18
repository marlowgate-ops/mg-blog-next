
import React from "react";
import { loadReviewHtml } from "@/lib/reviewLoader";

export default async function ReviewContent({ id }: { id: string }) {
  const html = await loadReviewHtml(id);
  return <div className="mg-review-text" dangerouslySetInnerHTML={{ __html: html }} />;
}
