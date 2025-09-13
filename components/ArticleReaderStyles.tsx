'use client'
export default function ArticleReaderStyles() {
  return (
    <style jsx global>{`
      /* Base rhythm */
      article {
        --fg: #0f172a;
        --muted: #475569;
        --border: rgba(15,23,42,.08);
        --accent: #0ea5e9;
        --bg-soft: #f8fafc;
        line-height: 1.85;
        font-size: 16.5px;
        letter-spacing: .01em;
      }
      @media (min-width: 768px) {
        article { font-size: 17px; }
      }

      /* Headings */
      article h1, article h2, article h3 {
        line-height: 1.3;
        scroll-margin-top: 84px;
      }
      article h2 { margin-top: 2.2em; margin-bottom: .8em; font-weight: 800; }
      article h3 { margin-top: 1.6em; margin-bottom: .6em; font-weight: 700; }

      /* Paragraph & list spacing */
      article p { margin: 1.05em 0; color: var(--fg); }
      article ul, article ol { margin: 1em 0 1.2em 1.35em; }
      article li { margin: .35em 0; }

      /* Blockquote */
      article blockquote {
        margin: 1.6em 0;
        padding: .9em 1.1em;
        background: var(--bg-soft);
        border-left: 4px solid var(--accent);
        color: #0b1324;
        border-radius: 8px;
      }

      /* Code */
      article :not(pre) > code {
        background: #0b1220;
        color: #e2e8f0;
        padding: .15em .38em;
        border-radius: 6px;
        font-size: .92em;
      }
      article pre {
        background: #0b1220;
        color: #e2e8f0;
        padding: 16px 18px;
        border-radius: 12px;
        overflow: auto;
        box-shadow: inset 0 0 0 1px rgba(148,163,184,.12);
        margin: 1.4em 0;
      }

      /* Links */
      article a {
        color: #0b76c5;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }
      article a:hover { color: #075d9e; }

      /* Tables */
      article table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.4em 0;
        font-size: .98em;
      }
      article th, article td {
        padding: .6em .7em;
        border: 1px solid var(--border);
      }
      article thead th {
        background: #f1f5f9;
        font-weight: 700;
      }

      /* Figures & images */
      article figure { margin: 1.4em 0; }
      article img { border-radius: 10px; box-shadow: 0 8px 30px rgba(2,8,23,.08); }

      /* Footnotes (simple) */
      article sup, article sub { line-height: 0; }
      article sup a { text-decoration: none; }

      /* Dark mode (prefers-color-scheme) */
      @media (prefers-color-scheme: dark) {
        article {
          --fg: #e6eef8;
          --muted: #9fb6d1;
          --border: rgba(148,163,184,.22);
          --accent: #38bdf8;
          --bg-soft: rgba(148,163,184,.06);
          color: var(--fg);
        }
        article p { color: var(--fg); }
        article blockquote { color: #e6eef8; }
        article thead th { background: rgba(148,163,184,.12); }
        article a { color: #8cd0ff; }
        article a:hover { color: #b8e1ff; }
        article img { box-shadow: 0 8px 30px rgba(0,0,0,.4); }
      }
    `}</style>
  )
}
