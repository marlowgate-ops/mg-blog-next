'use client'
import { pollQuestion, pollOptions } from '@/data/poll'
import { useEffect, useMemo, useState } from 'react'

export default function PollWidget(){
  const KEY = 'mg_poll_votes_fx'
  const [voted, setVoted] = useState<string | null>(null)
  const [local, setLocal] = useState<Record<string, number>>({})
  useEffect(()=>{
    const raw = localStorage.getItem(KEY)
    if(raw){ setLocal(JSON.parse(raw)); }
  },[])
  function vote(code:string){
    if(voted) return
    const next = { ...local, [code]: (local[code] ?? 0) + 1 }
    setLocal(next); setVoted(code)
    localStorage.setItem(KEY, JSON.stringify(next))
  }
  const merged = useMemo(()=>{
    const m = pollOptions.map(o=> ({...o, votes:o.votes + (local[o.code] ?? 0)}))
    const total = m.reduce((s,i)=>s+i.votes,0)
    return { list:m, total }
  },[local])
  return (
    <div className="poll">
      <div className="q">{pollQuestion}</div>
      <ul className="opts">
        {merged.list.map(o=>{
          const pct = merged.total ? Math.round(o.votes/merged.total*100) : 0
          return (
            <li key={o.code} className={voted===o.code?'on':''} onClick={()=>vote(o.code)}>
              <div className="bar" style={{width:`${pct}%`}} />
              <span className="name">{o.name}</span>
              <span className="pct">{pct}%</span>
            </li>
          )
        })}
      </ul>
      <div className="note">投票は端末内に保存されます。参考指標であり正確な世論調査ではありません。</div>
      <style jsx>{`
        .q{font-weight:700;margin-bottom:8px}
        .opts{display:grid;gap:8px}
        .opts li{position:relative;cursor:pointer;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px;background:#fff;overflow:hidden}
        .opts li .bar{position:absolute;left:0;top:0;bottom:0;background:#e0f2fe;z-index:0}
        .opts li .name,.opts li .pct{position:relative;z-index:1}
        .opts li.on{outline:2px solid #38bdf8}
        .note{color:#64748b;margin-top:6px}
      `}</style>
    </div>
  )
}
