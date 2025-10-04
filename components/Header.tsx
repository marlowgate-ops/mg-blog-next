'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import SearchTypeahead from './SearchTypeahead'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  useEffect(()=>{
    const onScroll=()=> setScrolled(window.scrollY>6)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  const isInsurancePage = pathname?.startsWith('/insurance')

  return (
    <header className={`hd ${scrolled ? 'shadow' : ''}`}>
      <div className="topbar">
        <div className="brand">
          <Link href="/" className="brand-link">
            <Image 
              src="/brand/logo.svg" 
              alt="Marlow Gate ロゴ" 
              width={28} 
              height={28}
              className="logo"
              priority
            />
            <span className="brand-text">Marlow Gate</span>
          </Link>
        </div>
        <nav className="util" aria-label="primary" data-testid="main-navigation">
          <Link className="u" href="/best">比較</Link>
          <Link className="u" href="/reviews">レビュー</Link>
          <Link className="u" href="/guides">ガイド</Link>
          <Link className="u" href="/topics">トピック</Link>
          <Link className="u" href="/bookmarks">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '4px'}}>
              <path d="M3 2C3 1.44772 3.44772 1 4 1H12C12.5523 1 13 1.44772 13 2V14L8 11L3 14V2Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            ブックマーク
          </Link>
          <Link className="u rss" href="/feed/posts.xml" title="ブログRSS" aria-label="ブログRSS">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.818c-.062-8.71-7.118-15.758-15.84-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
            </svg>
          </Link>
          <Link className="u" href="/about">About</Link>
        </nav>
      </div>
      <div className="menubar">
        <nav className="nav" aria-label="secondary">
          <Link className="i" href="/">トップ</Link>
          <Link className="i" href="/best/forex-brokers-jp">国内FX/CFD</Link>
          <Link className={`i ${isInsurancePage ? 'active' : ''}`} href="/insurance">保険</Link>
          <Link className="i" href="/rankings">ランキング</Link>
          <Link className="i" href="/popular">人気記事</Link>
          <Link className="i" href="/blog">ブログ</Link>
          <Link className="i" href="/sitemap.xml">サイトマップ</Link>
        </nav>
        <div className="search-wrapper">
          <SearchTypeahead 
            placeholder="記事、業者、ツールを検索..." 
            className="header-search"
          />
        </div>
      </div>
      <style jsx>{`
        .hd { position:sticky; top:0; z-index:40; backdrop-filter:saturate(180%) blur(8px);
              background:rgba(255,255,255,.78); border-bottom:1px solid #e5e7eb; }
        .shadow { box-shadow:0 2px 6px rgba(0,0,0,.06); }
        .topbar, .menubar { max-width:1100px; margin:0 auto; padding:6px 12px; display:flex; align-items:center; justify-content:space-between; }
        .brand { font-weight:700; letter-spacing:.3px; }
        .brand-link { display:flex; align-items:center; gap:0.5rem; }
        .logo { width:28px; height:28px; flex-shrink:0; }
        .brand-text { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .util, .nav { display:flex; gap:10px; }
        .u, .i { padding:6px 10px; border-radius:10px; }
        .u:hover, .i:hover { background:#f3f4f6; }
        .u.rss { padding:6px 8px; display:flex; align-items:center; color:#ff6600; }
        .u.rss:hover { background:#fff3e6; }
        .i.active { background:#e0f2fe; color:#0284c7; font-weight:600; }
        .menubar { padding-top:4px; padding-bottom:10px; }
        .search-wrapper { min-width:200px; }
        .search-wrapper :global(.header-search) { width:100%; max-width:250px; }
        .search-wrapper :global(.header-search .searchInput) { 
          font-size:14px; 
          padding:8px 12px;
          border-radius:8px;
        }
        .search-wrapper :global(.header-search .searchButton) { 
          padding:8px 10px;
          border-radius:0 8px 8px 0;
        }
        @media (max-width:720px){ 
          .nav { display:none; } 
          .logo { width:24px; height:24px; } 
        }
        @media (max-width:480px){ 
          .brand-text { max-width:120px; } 
        }
      `}</style>
    </header>
  )
}
