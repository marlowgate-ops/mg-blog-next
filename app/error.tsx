'use client'

import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body className="mx-auto max-w-3xl px-5 py-16">
        <main className="rounded-3xl border p-8 text-center">
          <h1 className="text-3xl font-bold">エラーが発生しました</h1>
          <p className="mt-3 text-neutral-600">一時的な問題の可能性があります。数秒後に再試行してください。</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => reset()} className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">再試行</button>
            <Link href="/" className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50">トップへ戻る</Link>
          </div>
          <p className="mt-6 text-xs text-neutral-500">詳細: {error?.message}</p>
        </main>
      </body>
    </html>
  )
}
