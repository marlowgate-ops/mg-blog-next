'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(()=>{
    const onScroll=()=> setScrolled(window.scrollY>6)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <header className={`hd ${scrolled ? 'shadow' : ''}`}>
      <div className="topbar">
        <Link className="brand" href="/">Marlow Gate</Link>
        <nav className="util">
          <Link href="/best/forex-brokers-jp/" className="u">比較</Link>
          <Link href="/reviews/dmm/" className="u">レビュー</Link>
          <Link href="/about" className="u">About</Link>
        </nav>
      </div>
      <div className="menubar">
        <nav className="nav">
          <Link href="/best/forex-brokers-jp/" className="i">国内FX/CFD</Link>
          <Link href="/best/" className="i">ランキング一覧</Link>
          <Link href="/guides/" className="i">ガイド</Link>
        </nav>
      </div>
      <style jsx>{`
        .hd { position:sticky; top:0; z-index:40; backdrop-filter:saturate(180%) blur(8px); background:rgba(255,255,255,.78); border-bottom:1px solid #e5e7eb; }
        .shadow { box-shadow:0 2px 6px rgba(0,0,0,.06); }
        .topbar, .menubar { max-width:1100px; margin:0 auto; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; }
        .brand { font-weight:700; letter-spacing:.3px; }
        .util, .nav { display:flex; gap:12px; }
        .u, .i { padding:6px 10px; border-radius:10px; }
        .u:hover, .i:hover { background:#f3f4f6; }
        .menubar { padding-top:6px; padding-bottom:10px; }
        @media (max-width:720px){ .menubar{ display:none; } }
      `}</style>
    </header>
  )
}
