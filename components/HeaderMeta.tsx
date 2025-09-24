import Link from 'next/link'
import styles from '../app/best/layout.module.css'

interface HeaderMetaProps {
  children?: React.ReactNode // Right-aligned slot for PR badge or other content
}

export default function HeaderMeta({ children }: HeaderMetaProps) {
  return (
    <div className={styles.headerMeta}>
      <nav aria-label="Breadcrumb">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>→</span>
          <Link href="/best">ベスト</Link>
          <span>→</span>
          <span>FX会社比較</span>
        </div>
      </nav>
      
      {children && (
        <div>
          {children}
        </div>
      )}
    </div>
  )
}