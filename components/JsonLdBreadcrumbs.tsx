'use client'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function JsonLdBreadcrumbs() {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)
  const site = process.env.NEXT_PUBLIC_SITE_URL

  const json: any = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '' },
      ...segments.map((seg, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: decodeURIComponent(seg),
        item: segments.slice(0, idx + 1).join('/'),
      })),
    ],
  }

  const data = JSON.stringify(json)

  return (
    <Script id="jsonld-breadcrumbs" type="application/ld+json" strategy="afterInteractive">
      {`(function(){try{
        var d=${data};
        var origin='${site ?? ''}'||window.location.origin;
        d.itemListElement=d.itemListElement.map(function(li){
          var href = origin + '/' + String(li.item||'').replace(/^\/+|\/+$/g,'');
          if (li.position===1) href = origin + '/';
          return Object.assign({}, li, { item: href });
        });
        document.currentScript && document.currentScript.insertAdjacentText('afterend', JSON.stringify(d));
        document.currentScript.remove();
      }catch(e){}})();`}
    </Script>
  )
}
