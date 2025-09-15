'use client'
import Link from "next/link"

export default function Header() {
  return (
    <header className="hd" role="banner" aria-label="Site header">
      <div className="in">
        <Link href="/" className="brand">Marlow Gate</Link>
        <nav className="nav" aria-label="Global">
          <Link href="/best/forex-brokers-jp/" className="item">比較</Link>
          <Link href="/reviews/dmm/" className="item">レビュー</Link>
          <Link href="/about" className="item">About</Link>
        </nav>
      </div>
      <style jsx>{`
        .hd { position:sticky; top:0; z-index:40; backdrop-filter:saturate(180%) blur(8px); background:rgba(255,255,255,.75); border-bottom:1px solid #e5e7eb; }
        .in { max-width:1100px; margin:0 auto; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; }
        .brand { font-weight:700; letter-spacing:.3px; }
        .nav { display:flex; gap:12px; }
        .item { padding:6px 10px; border-radius:10px; }
        .item:hover { background:#f3f4f6; }
      `}</style>
    </header>
  )
}
