import Link from 'next/link'
import s from './endcta.module.css'

const read = (key: string, fallback = '') => process.env[key] ?? fallback

export default function EndCTA() {
  const url = read('NEXT_PUBLIC_CTA_URL', '/gumroad')
  const label = read('NEXT_PUBLIC_CTA_LABEL', '詳細を見る')
  const benefitsRaw = read('NEXT_PUBLIC_CTA_BENEFITS', '最短で理解|手戻りを抑制|実務ですぐ使える')
  const benefits = benefitsRaw.split('|').map(t => t.trim()).filter(Boolean)
  const note = read('NEXT_PUBLIC_COPY_VARIANT', 'A')

  return (
    <section className={s.wrap} aria-labelledby="cta-end">
      <div className={s.cta}>
        <h2 id="cta-end" className={s.title}>次の一歩を、今日から。</h2>
        <p className={s.desc}>ブログで学んだ内容をすぐ実務に落とすための資料をご用意しました。</p>
        <ul className={s.list}>
          {benefits.map((b, i) => <li key={i} className={s.li}>{b}</li>)}
        </ul>
        <div className={s.row}>
          <Link href={url} className={s.btn} data-variant={note} prefetch={false}>{label}</Link>
          <Link href="/blog" className={`${s.btn} ${s.ghost}`} prefetch={false}>記事一覧へ</Link>
        </div>
      </div>
    </section>
  )
}
