import type { Metadata } from 'next'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  metadataBase: new URL(SITE.url)
}

function GA4(){
  const id = process.env.NEXT_PUBLIC_GA4_ID
  if(!id) return null
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script dangerouslySetInnerHTML={{__html:`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}', { anonymize_ip: true });
      `}} />
    </>
  )
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="ja">
      <body style={{ fontFamily:'ui-sans-serif, system-ui', margin:0, color:'#111', lineHeight:1.65 }}>
        <nav aria-label="Primary" style={{ padding:'16px 20px', borderBottom:'1px solid #eee', background:'#fff' }}>
          <div style={{ maxWidth:980, margin:'0 auto', display:'flex', alignItems:'center', gap:16, justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <a href="https://marlowgate.com/" style={{ textDecoration:'none', color:'#111', fontWeight:700 }}>Marlow Gate</a>
              <a href="/blog" style={{ textDecoration:'none', color:'#111' }}>Blog</a>
              <a href="/about" style={{ textDecoration:'none', color:'#111' }}>About</a>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <a href="/rss.xml" style={{ textDecoration:'none', color:'#111' }}>RSS</a>
              <a href="/sitemap.xml" style={{ textDecoration:'none', color:'#111' }}>Sitemap</a>
              <a href="https://marlowgate.com/store/" style={{ textDecoration:'none', color:'#111' }}>Store</a>
            </div>
          </div>
        </nav>
        {children}
        <footer style={{ padding:'28px 20px', borderTop:'1px solid #eee', color:'#666', background:'#fafafa' }}>
          <div style={{ maxWidth:980, margin:'0 auto', display:'flex', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
            <div>© {new Date().getFullYear()} Marlow Gate</div>
            <div style={{ display:'flex', gap:14 }}>
              <a href="/blog" style={{ textDecoration:'none', color:'#666' }}>Blog</a>
              <a href="/about" style={{ textDecoration:'none', color:'#666' }}>About</a>
              <a href="/rss.xml" style={{ textDecoration:'none', color:'#666' }}>RSS</a>
              <a href="/sitemap.xml" style={{ textDecoration:'none', color:'#666' }}>Sitemap</a>
              <a href="https://marlowgate.com/" style={{ textDecoration:'none', color:'#666' }}>LP</a>
              <a href="https://marlowgate.com/store/" style={{ textDecoration:'none', color:'#666' }}>Store</a>
            </div>
          </div>
        </footer>
        <GA4 />
      </body>
    </html>
  )
}
