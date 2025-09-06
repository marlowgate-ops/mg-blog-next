// lib/post.ts
// Frontmatterの日付キー揺れを吸収
export const pickDate = (p: any): string | undefined => {
  const d = p?.date ?? p?.pubDate ?? p?.publishedAt ?? p?.published
  return d ? String(d) : undefined
}

export const toTime = (p: any): number => {
  const d = pickDate(p)
  return d ? new Date(d).getTime() : 0
}
