export const runtime = 'edge';
import { ImageResponse } from 'next/og'
import { brokers } from '@/data/brokers'

function top(mode: string) {
  const list = [...(brokers as any[])].filter(b => (b as any)?.state !== 'preparing')
  list.sort((a:any,b:any)=>{
    if (mode==='total') return (b?.score??0)-(a?.score??0)
    const ax=a?.subs?.[mode]??0; const bx=b?.subs?.[mode]??0; return bx-ax
  })
  return list[0]
}

export default async function Image() {
  const mode = 'cost';
  const first: any = top(mode)
  const brand = first?.name || first?.brand || '—'
  const score = (mode==='cost') ? (first?.subs?.[mode] ?? 0) : (first?.score ?? 0)
  const title = '低スプレッドで選ぶ（コスト重視）'

  return new ImageResponse(
    (
      <div style={{width:'100%',height:'100%',display:'flex',background:'linear-gradient(135deg,#0f172a,#0b2b3a)',color:'#e6f9ff',fontSize:44,padding:'48px 56px',flexDirection:'column',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{width:64,height:64,borderRadius:16,background:'#0ea5b7',display:'grid',placeItems:'center',fontSize:34,fontWeight:800,color:'#032c33'}}>MG</div>
          <div style={{fontSize:28,opacity:.9}}>Marlow Gate</div>
        </div>
        <div style={{lineHeight:1.2}}>
          <div style={{fontSize:54,fontWeight:800}}>{title}</div>
          <div style={{fontSize:28,marginTop:10,opacity:.9}}>1位: {brand}　スコア: {String(score)}</div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div style={{fontSize:22,opacity:.6}}>自動生成OGP</div>
        </div>
      </div>
    ), { width:1200, height:630 }
  )
}
