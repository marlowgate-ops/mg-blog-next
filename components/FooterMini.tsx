'use client'
import styles from './footer.module.css'
import Link from 'next/link'

const storeUrl = process.env.NEXT_PUBLIC_CTA_URL || process.env.NEXT_PUBLIC_HERO_CTA_URL || '/'
const showSitemap = process.env.NEXT_PUBLIC_SHOW_SITEMAP_LINK === '1'

export default function FooterMini() {
  const year = new Date().getFullYear()
  return (
    <>
      {/* Sitemap Section */}
      <section className={styles.sitemap} aria-label="Site navigation">
        <div className={styles.sitemapInner}>
          <div className={styles.sitemapGrid}>
            <div className={styles.sitemapColumn}>
              <h3 className={styles.sitemapTitle}>保険</h3>
              <nav className={styles.sitemapNav}>
                <Link href="/insurance" className={styles.sitemapLink}>保険トップ</Link>
                <Link href="/insurance/compare/auto" className={styles.sitemapLink}>自動車保険比較</Link>
                <Link href="/insurance/compare/life" className={styles.sitemapLink}>生命保険比較</Link>
                <Link href="/insurance/compare/medical" className={styles.sitemapLink}>医療保険比較</Link>
              </nav>
            </div>
            <div className={styles.sitemapColumn}>
              <h3 className={styles.sitemapTitle}>FX・投資</h3>
              <nav className={styles.sitemapNav}>
                <Link href="/best/forex-brokers-jp" className={styles.sitemapLink}>国内FX比較</Link>
                <Link href="/best/low-spread" className={styles.sitemapLink}>低スプレッド</Link>
                <Link href="/best/campaigns" className={styles.sitemapLink}>キャンペーン</Link>
              </nav>
            </div>
            <div className={styles.sitemapColumn}>
              <h3 className={styles.sitemapTitle}>コンテンツ</h3>
              <nav className={styles.sitemapNav}>
                <Link href="/blog" className={styles.sitemapLink}>ブログ</Link>
                <Link href="/news" className={styles.sitemapLink}>ニュース</Link>
                <Link href="/events" className={styles.sitemapLink}>イベント</Link>
                <Link href="/reviews" className={styles.sitemapLink}>レビュー</Link>
                <Link href="/guides" className={styles.sitemapLink}>ガイド</Link>
              </nav>
            </div>
            <div className={styles.sitemapColumn}>
              <h3 className={styles.sitemapTitle}>フィード</h3>
              <nav className={styles.sitemapNav}>
                <Link href="/feed/posts.xml" className={styles.sitemapLink}>ブログRSS</Link>
                <Link href="/feed/news.xml" className={styles.sitemapLink}>ニュースRSS</Link>
                <Link href="/opensearch.xml" className={styles.sitemapLink}>検索エンジン</Link>
                <Link href="/sitemap.xml" className={styles.sitemapLink}>サイトマップ</Link>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className={styles.footer} aria-label="Site footer">
        <div className={styles.inner}>
          <div className={styles.brand}>
            <span className={styles.dot} />
            <strong>Marlow Gate</strong> <span className={styles.sep}>•</span> {year}
          </div>
          <nav className={styles.nav} aria-label="Footer links">
            <Link href="/about" className={styles.link}>About</Link>
            <Link href="/privacy" className={styles.link}>Privacy</Link>
            <Link href="/disclaimer" className={styles.link}>免責事項</Link>
            <Link href="/policy" className={styles.link}>サイトポリシー</Link>
            <Link href="/feed/posts.xml" className={styles.link}>ブログRSS</Link>
            <Link href="/feed/news.xml" className={styles.link}>ニュースRSS</Link>
            {showSitemap ? <Link href="/sitemap.xml" className={styles.link}>Sitemap</Link> : null}
            <a href={storeUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>Store</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
