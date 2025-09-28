export const metadata = {
  title: '広告・アフィリエイトの開示',
  description: '本サイトには広告（アフィリエイトリンク）が含まれます。表現・比較は編集部のポリシーに基づき公平性に配慮します。'
}

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">広告・アフィリエイトの開示</h1>
      <p className="mb-4">本サイトの一部ページには、アフィリエイト広告リンク（<code>rel=&quot;sponsored&quot;</code>）が含まれます。リンクのクリックや口座開設等の成果に応じて報酬を受け取る場合があります。</p>
      <h2 className="text-xl font-semibold mt-8 mb-3">運用ポリシー</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>おすすめ/比較は、手数料・スプレッド・約定力・使い勝手等の客観的項目を重視します。</li>
        <li>掲載順は編集部の判断であり、広告の有無だけで左右されません。</li>
        <li>記事内の価格/条件は変動するため、最新情報は各公式サイトをご確認ください。</li>
      </ul>
      <p className="mt-8">お問い合わせ：<a className="underline" href="mailto:support@marlowgate.com">support@marlowgate.com</a></p>
    </main>
  )
}
