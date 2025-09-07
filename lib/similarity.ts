export function ngrams(text: string, n: number): Set<string> {
  const s = (text || '').toLowerCase().replace(/\s+/g, '')
  const grams = new Set<string>()
  for (let i = 0; i <= Math.max(0, s.length - n); i++) {
    grams.add(s.slice(i, i + n))
  }
  return grams
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 0
  let inter = 0
  for (const x of a) {
    if (b.has(x)) inter++
  }
  return inter / (a.size + b.size - inter || 1)
}

export function titleDescSimilarity(aTitle: string, aDesc: string, bTitle: string, bDesc: string) {
  const a2 = ngrams(aTitle + ' ' + aDesc, 2)
  const b2 = ngrams(bTitle + ' ' + bDesc, 2)
  const a3 = ngrams(aTitle + ' ' + aDesc, 3)
  const b3 = ngrams(bTitle + ' ' + bDesc, 3)
  // mix 2-gram and 3-gram Jaccard
  return 0.6 * jaccard(a2, b2) + 0.4 * jaccard(a3, b3)
}
