import Link from "next/link";
export const metadata = { title: "比較：FX・CFD" };
export default function Page() {
  return (
    <main style={{padding:"16px"}}>
      <h1>比較メニュー</h1>
      <ul>
        <li><Link href="/best/forex-brokers-jp">国内向けおすすめFX・CFD業者ランキング</Link></li>
      </ul>
    </main>
  );
}
