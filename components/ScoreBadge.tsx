import React from 'react'

type Props = { score: number, label?: string }
export default function ScoreBadge({ score, label='総合スコア' }: Props) {
  const s = Math.max(0, Math.min(100, Math.round(score)))
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl shadow-sm border">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-xl font-bold">{s}</span>
      <span className="text-sm text-gray-500">/ 100</span>
    </div>
  )
}
