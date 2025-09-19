'use client'
import { pollQuestion, pollOptions } from '@/data/poll'
import { useEffect, useMemo, useState } from 'react'
export default function PollWidget(){
  const KEY='mg_poll_votes_fx'
  const [voted,setVoted]=useState(null as string|null)
  const [local,setLocal]=useState({} as Record<string,number>)
  useEffect(()=>{ const raw=localStorage.getItem(KEY); if(raw) setLocal(JSON.parse(raw)) },[])
  function vote(code:string){ if(voted) return; const next={...local, [code]:(local[code]??0)+1}; setLocal(next); setVoted(code); localStorage.setItem(KEY, JSON.stringify(next)) }
  const merged = useMemo(()=>{ const m=pollOptions.map(o=>({...o, votes:o.votes+(local[o.code]??0)})); const total=m.reduce((s,i)=>s+i.votes,0); return {list:m,total}; },[local])
  return (
    <div>
      <div style={{fontWeight:700,marginBottom:8}}>{pollQuestion}</div>
      <ul style={{display:'grid',gap:8}}>
        {merged.list.map(o=>{ const pct = merged.total? Math.round(o.votes/merged.total*100):0; return (
          <li key={o.code} onClick={()=>vote(o.code)} style={{position:'relative',cursor:'pointer',border:'1px solid #e5e7eb',borderRadius:10,padding:'8px 10px',background:'#fff',overflow:'hidden'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,background:'#e0f2fe',width:`${pct}%`}}/>
            <span style={{position:'relative',zIndex:1}}>{o.name}</span>
            <span style={{position:'relative',float:'right',zIndex:1}}>{pct}%</span>
          </li>
        )})}
      </ul>
      <div style={{color:'#64748b',marginTop:6}}>投票は端末内に保存されます。参考指標であり正確な世論調査ではありません。</div>
    </div>
  )
}
