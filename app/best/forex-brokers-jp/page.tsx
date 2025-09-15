import AffLink from '@/components/AffLink'
import ProsCons from '@/components/ProsCons'
import ScoreBadge from '@/components/ScoreBadge'
import { AFF } from '@/lib/aff-config'
import { itemListJsonLd } from '@/lib/seo/jsonldItemList'

export const dynamic = 'force-static'

export const metadata = {
  title: '【2025年版】国内向けおすすめFX・CFD業者ランキング',
  description: '手数料・スプレッド・約定力・日本語サポートを総合評価。使い方別の最適ブローカを厳選。'
}

const items = [
  { name: 'OANDA Japan', url: AFF.OANDA, position: 1, brand: 'OANDA' },
  { name: 'XMTrading', url: AFF.XM, position: 2, brand: 'XM' },
  { name: 'Titan FX', url: AFF.TITAN, position: 3, brand: 'Titan FX' },
]

export default function Page() {
  const jsonLd = itemListJsonLd(items)
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
      <div className="mb-6 text-sm text-gray-600">※本ページには広告が含まれます。<a className="underline" href="/disclosure">詳細</a></div>
      <h1 className="text-2xl md:text-3xl font-bold">【2025年版】国内向けおすすめFX・CFD業者ランキング</h1>
      <p className="mt-3 text-gray-700">編集方針：初心者〜中級までが「いま実利があるか」を重視。短期取引の安全性（スプレッド＆約定）、入出金、サポートを総合評価。</p>

      <section className="mt-8 grid gap-6">
        {items.map((b, idx) => (
          <article key={b.name} className="p-5 rounded-2xl border shadow-sm bg-white">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-semibold">{idx+1}. {b.name}</h2>
              <ScoreBadge score={idx===0?92:idx===1?88:85} />
            </div>
            <ProsCons
              className="mt-3"
              pros={idx===0 ? ['約定力に定評','自動売買勢に人気','日本拠点の信頼感'] :
                    idx===1 ? ['ボーナスが豊富','メジャー通貨のコスト競争力','約定は素直'] :
                              ['安定したスプレッド','約定速度が良い','株価指数も快適']}
              cons={idx===0 ? ['キャンペーンは少なめ'] :
                    idx===1 ? ['出金ルールに注意'] :
                              ['国内銀行入出金の条件を確認']}
            />
            <div className="mt-4 flex gap-3">
              <AffLink href={b.url} brand={b.brand!} placement="top" className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-black text-white">
                公式サイトで口座開設
              </AffLink>
              <a href={`/reviews/${b.brand?.toLowerCase()}`} className="inline-flex items-center justify-center px-4 py-2 rounded-xl border">
                詳細レビュー
              </a>
            </div>
          </article>
        ))}
      </section>

      <aside className="mt-10 text-sm text-gray-600">
        表示の順序やスコアは編集部判断です。料金や条件は変動します。最新は各公式をご確認ください。
      </aside>
    </main>
  )
}
