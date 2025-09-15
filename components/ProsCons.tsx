import React from 'react'

type Props = {
  pros: string[]
  cons: string[]
  className?: string
}

export default function ProsCons({ pros=[], cons=[], className='' }: Props) {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-2">良い点</h3>
        <ul className="space-y-2 list-disc pl-5">
          {pros.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">注意点</h3>
        <ul className="space-y-2 list-disc pl-5">
          {cons.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
    </div>
  )
}
