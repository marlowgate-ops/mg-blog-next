import Link from "next/link";
export const metadata = { title: "比較：FX・CFD" };
export default function Page() {
  return (
    <main style={{padding:"16px"}}>
      <h1>比較メニュー</h1>
      <ul>
        <li><Link href="/best/forex-brokers-jp">国内向けおすすめFX・CFD業者ランキング</Link></li>
        <li><a href="/best/low-spread">低スプレッドで選ぶ（コスト重視）</a></li>
  <li><a href="/best/app">アプリの使いやすさで選ぶ</a></li>
  <li><a href="/best/tools">取引ツール・機能で選ぶ</a></li>
  <li><a href="/best/campaigns">口座開設キャンペーン一覧</a></li>
</ul>
    </main>
  );
}
