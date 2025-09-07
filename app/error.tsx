'use client'
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-neutral-600">再読み込みするか、トップへ戻ってください。</p>
        <button onClick={() => reset()} className="underline mt-6">Retry</button>
      </body>
    </html>
  )
}
