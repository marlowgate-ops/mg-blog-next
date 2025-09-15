'use client'
export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="container">
      <h1>{title}</h1>
      <div className="content">{children}</div>
      <style jsx>{`
        .container { max-width: 820px; margin: 0 auto; padding: 32px 20px; }
        h1 { font-size: 1.8rem; margin: 0 0 12px; }
        h2 { margin: 18px 0 8px; }
        p { line-height: 1.85; margin: 8px 0; }
        ul { margin: 8px 0 12px 1.1em; }
        code { background: #f3f4f6; padding: 0 4px; border-radius: 4px; }
        small { color: #666; }
      `}</style>
    </main>
  );
}
