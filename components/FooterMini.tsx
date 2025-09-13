'use client'
import styles from './footer.module.css'
const storeUrl = process.env.NEXT_PUBLIC_CTA_URL || process.env.NEXT_PUBLIC_HERO_CTA_URL || '/'
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
          <a href="/rss.xml" className={styles.link}>RSS</a>
          <a href="/sitemap.xml" className={styles.link}>Sitemap</a>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>Store</a>
        </nav>
      </div>
    </footer>
  )
}
