'use client'
import Image from 'next/image'
import {useState} from 'react'

export default function BrandLogo({code, alt}:{code:string; alt:string}){
  const [src,setSrc] = useState(`/brands/${code}.svg`)
  const [showFallback,setShowFallback]=useState(false)
  return (
    <span className="brandLogo" aria-label={`${alt} ロゴ`}>
      {!showFallback && (
        <Image
          src={src}
          alt={alt}
          width={24}
          height={24}
          onError={()=>{
            if(src.endsWith('.svg')) setSrc(`/brands/${code}.png`)
            else setShowFallback(true)
          }}
        />
      )}
      {showFallback && <span className="fallback" aria-hidden="true">{code.toUpperCase().slice(0,3)}</span>}
      <style jsx>{`
        .brandLogo{display:inline-flex;align-items:center;gap:6px}
        .fallback{display:inline-flex; width:24px; height:24px; border-radius:6px;
          background:#111; color:#fff; font-size:11px; align-items:center; justify-content:center}
      `}</style>
    </span>
  )
}
