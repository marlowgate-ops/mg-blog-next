import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { renderSafeMarkdown } from "./markdown";
import { LONG_REVIEW } from "@/data/brokers";

const getReview = (id: string) => LONG_REVIEW?.[id] ?? "";

export async function loadReviewHtml(id: string): Promise<string> {
  const contentDir = path.join(process.cwd(), "content", "reviews");
  const mdPath = path.join(contentDir, `${id}.md`);
  try {
    const md = await fs.readFile(mdPath, "utf8");
    return renderSafeMarkdown(md);
  } catch {
    const fallback = getReview(id);
    return renderSafeMarkdown(fallback);
  }
}
