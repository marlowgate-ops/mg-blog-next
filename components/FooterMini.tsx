'use client'
import styles from './footer.module.css'
const storeUrl = process.env.NEXT_PUBLIC_CTA_URL || process.env.NEXT_PUBLIC_HERO_CTA_URL || '/'
const showRss = process.env.NEXT_PUBLIC_SHOW_RSS_LINK === '1'
const showSitemap = process.env.NEXT_PUBLIC_SHOW_SITEMAP_LINK === '1'

export default function FooterMini() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.dot} />
          <strong>Marlow Gate</strong> <span className={styles.sep}>•</span> {year}
        </div>
        <nav className={styles.nav} aria-label="Footer links">
          <a href="/about" className={styles.link}>About</a>
          <a href="/privacy" className={styles.link}>Privacy</a>
          <a href="/disclaimer" className={styles.link}>免責事項</a>
          <a href="/policy" className={styles.link}>サイトポリシー</a>
          {showRss ? <a href="/rss.xml" className={styles.link}>RSS</a> : null}
          {showSitemap ? <a href="/sitemap.xml" className={styles.link}>Sitemap</a> : null}
          <a href={storeUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>Store</a>
        </nav>
      </div>
    </footer>
  )
}
