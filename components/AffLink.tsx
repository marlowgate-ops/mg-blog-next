'use client'
type Props={href:string; children:React.ReactNode; gaLabel?:string; className?:string; rel?:string; target?:string}
export default function AffLink({href,children,gaLabel,className,rel,target}:Props){
  const onClick=()=>{try{
    const label=gaLabel|| (typeof children==='string'?children:'aff_click')
    if(typeof window!=='undefined' && typeof (window as any).gtag==='function'){
      ;(window as any).gtag('event','affiliate_click',{
        event_category:'engagement',
        event_label:label,
        link_url:href,
        value:1,
        debug_mode: typeof window!=='undefined' && window.location.search.includes('debug=1'),
        transport_type:'beacon',
      })
    }
  }catch{}}
  return <a href={href} onClick={onClick} className={className} rel={rel||'sponsored noopener nofollow'} target={target}>{children}</a>
}
