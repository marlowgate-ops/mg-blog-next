import Link from 'next/link'
import s from './endcta.module.css'

export default function EndCTA() {
  const url = process.env.NEXT_PUBLIC_CTA_URL || '/gumroad'
  const label = process.env.NEXT_PUBLIC_CTA_LABEL || '詳細を見る'
  const benefits = (process.env.NEXT_PUBLIC_CTA_BENEFITS || '最短で理解|手戻りを抑制|実務ですぐ使える')
    .split('|').map(t => t.trim()).filter(Boolean).slice(0,4)

  return (
    <aside className={s.wrap}>
      <div className={s.body}>
        <div>
          <h3 className={s.title}>業務テンプレ｜ICS検証ノート</h3>
          <p className={s.desc}>読了直後から実務に落とせる雛形＆検証プロセス。A/B文言とも連動可。</p>
          {benefits.length ? (
            <ul className={s.list}>
              {benefits.map((b,i)=>(<li key={i}>{b}</li>))}
            </ul>
          ) : null}
        </div>
        <div className={s.actions}>
          <Link href={url} className={s.btn} prefetch={false}>{label}</Link>
          <Link href="/blog" className={s.ghost} prefetch={false}>記事一覧へ</Link>
        </div>
      </div>
    </aside>
  )
}
