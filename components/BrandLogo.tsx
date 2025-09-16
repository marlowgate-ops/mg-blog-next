'use client'
import Image from 'next/image'

export default function BrandLogo({code, alt}:{code:string; alt:string}){
  const src = `/brands/${code}.svg`
  return (
    <span className="brandLogo">
      <Image src={src} alt={alt} width={24} height={24} onError={(e:any)=>{
        const el = e.currentTarget as HTMLImageElement
        el.style.display='none'
        const fallback = el.nextElementSibling as HTMLElement
        if(fallback) fallback.style.display='inline-flex'
      }}/>
      <span className="fallback" aria-hidden="true">{code.toUpperCase().slice(0,3)}</span>
      <style jsx>{`
        .brandLogo{display:inline-flex;align-items:center;gap:6px}
        .fallback{display:none; width:24px; height:24px; border-radius:6px;
          background:#111; color:#fff; font-size:11px; align-items:center; justify-content:center}
      `}</style>
    </span>
  )
}
