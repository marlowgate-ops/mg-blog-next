import React from 'react'

type Props = {
  pros: string[]
  cons: string[]
  className?: string
}

export default function ProsCons({ pros=[], cons=[], className='' }: Props) {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      <div data-testid="broker-pros">
        <h3 className="text-lg font-semibold mb-2">良い点</h3>
        <ul className="space-y-2 list-disc pl-5">
          {pros.map((p, i) => <li key={i} data-testid="pro-item">{p}</li>)}
        </ul>
      </div>
      <div data-testid="broker-cons">
        <h3 className="text-lg font-semibold mb-2">注意点</h3>
        <ul className="space-y-2 list-disc pl-5">
          {cons.map((c, i) => <li key={i} data-testid="con-item">{c}</li>)}
        </ul>
      </div>
    </div>
  )
}
