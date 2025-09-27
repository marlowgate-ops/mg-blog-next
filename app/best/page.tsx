import Link from "next/link";
import { generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
  title: "比較：FX・CFD業者ランキング",
  description: "国内FX・CFD業者の総合比較。スプレッド、手数料、アプリ、ツールで選ぶランキング一覧。",
  path: "/best",
});

export default function Page() {
  return (
    <main>
      <section data-section>
        <h1>比較メニュー</h1>
        <ul>
          <li>
            <Link href="/best/forex-brokers-jp">
              国内向けおすすめFX・CFD業者ランキング
            </Link>
          </li>
          <li>
            <Link href="/best/low-spread">
              低スプレッドで選ぶ（コスト重視）
            </Link>
          </li>
          <li>
            <Link href="/best/app">アプリの使いやすさで選ぶ</Link>
          </li>
          <li>
            <Link href="/best/tools">取引ツール・機能で選ぶ</Link>
          </li>
          <li>
            <Link href="/best/campaigns">口座開設キャンペーン一覧</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
