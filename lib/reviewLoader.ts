
import { promises as fs } from "fs";
import path from "path";
import { renderSafeMarkdown } from "./markdown";
import { LONG_REVIEW } from "@/data/brokers";

/** Load review content for a broker.
 * 1) Try /content/reviews/<id>.md (Markdown)
 * 2) Fallback to LONG_REVIEW[id] (plain text)
 * Returns sanitized HTML string.
 */
export async function loadReviewHtml(id: string): Promise<string> {
  const contentDir = path.join(process.cwd(), "content", "reviews");
  const mdPath = path.join(contentDir, `${id}.md`);
  try {
    const md = await fs.readFile(mdPath, "utf8");
    return renderSafeMarkdown(md);
  } catch {
    const fallback = LONG_REVIEW?.[id] || "";
    return renderSafeMarkdown(fallback);
  }
}
