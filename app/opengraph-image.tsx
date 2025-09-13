import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Marlow Gate – Blog'
  const tagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Readable insights. Practical playbooks.'
  return new ImageResponse(
    (<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',
      padding:48,background:'linear-gradient(180deg,#0b1220 0%,#0b1220 40%,#0a1a2b 100%)',color:'#e6f1ff',
      fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(1200px 500px at -10% -20%, rgba(14,165,233,.25), transparent 60%), radial-gradient(1000px 420px at 110% 120%, rgba(16,185,129,.18), transparent 55%)'}} />
      <div style={{ fontSize: 40, opacity: 0.9 }}>blog.marlowgate.com</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.06 }}>{site}</div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>{tagline}</div>
      </div>
      <div style={{ display:'flex',gap:14,alignItems:'center',fontSize:26 }}>
        <div style={{ padding:'8px 14px', borderRadius:999, background:'rgba(14,165,233,.15)', color:'#7dd3fc',
                      border:'1px solid rgba(14,165,233,.35)', fontWeight:700 }}>Marlow Gate</div>
        <div style={{ padding:'8px 14px', borderRadius:999, background:'rgba(226,232,240,.12)',
                      border:'1px solid rgba(226,232,240,.25)', color:'#e2e8f0' }}>Read • Build • Ship</div>
      </div>
    </div>), size)
}
