import Link from 'next/link'
import styles from './endcta.module.css'

const label = process.env.NEXT_PUBLIC_CTA_LABEL || '詳細を見る'
const url = process.env.NEXT_PUBLIC_CTA_URL || '/gumroad'
const benefits = (process.env.NEXT_PUBLIC_CTA_BENEFITS || '業務テンプレ｜ICS検証ノート').split('|').map(s => s.trim())

export default function EndCTA() {
  return (
    <aside className={styles.wrap}>
      <div className={styles.body}>
        <div>
          <h3 className={styles.title}>業務テンプレ｜ICS検証ノート</h3>
          <p className={styles.desc}>現場で使える検証ノート。買い切り・アップデート無料。</p>
          <ul className={styles.list}>
            {benefits.filter(Boolean).slice(0,4).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <div className={styles.actions}>
          <Link href={url} className={styles.btn}>{label}</Link>
          <Link href="/blog" className={styles.ghost}>トップへ</Link>
        </div>
      </div>
    </aside>
  )
}
