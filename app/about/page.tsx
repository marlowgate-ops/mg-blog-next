// app/about/page.tsx
export const revalidate = 3600

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 prose">
      <h1>About</h1>
      <p>Marlow Gate のブログです。取引データ、オートメーション、プロダクト更新情報などを発信します。</p>
      <ul>
        <li>RSS: <a href="/rss.xml">/rss.xml</a></li>
        <li>Sitemap: <a href="/sitemap.xml">/sitemap.xml</a></li>
        <li>Store: <a href="https://marlowgate.com/store/">/store</a></li>
      </ul>
    </main>
  )
}
