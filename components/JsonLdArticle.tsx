'use client'
import Script from 'next/script'

export default function JsonLdArticle() {
  return (
    <Script id="jsonld-article" type="application/ld+json" strategy="afterInteractive">
      {`(function(){try{
        var title = document.querySelector('h1')?.textContent || document.title;
        var desc = (document.querySelector('meta[name="description"]')||{}).content
                  || (document.querySelector('meta[property="og:description"]')||{}).content
                  || '';
        var url = window.location.href.split('#')[0];
        var img = (document.querySelector('meta[property="og:image"]')||{}).content || '';
        var datePublished = (document.querySelector('time[datetime]')||{}).getAttribute ?
                            document.querySelector('time[datetime]')?.getAttribute('datetime') : '';
        var site = (document.querySelector('meta[property="og:site_name"]')||{}).content || '';

        var data = {
          "@context":"https://schema.org",
          "@type":"BlogPosting",
          "headline": title,
          "description": desc,
          "mainEntityOfPage": {"@type":"WebPage","@id": url},
          "url": url,
          "image": img ? [img] : undefined,
          "datePublished": datePublished || undefined,
          "dateModified": datePublished || undefined,
          "publisher": site ? {"@type":"Organization","name": site} : undefined
        };
        document.currentScript && document.currentScript.insertAdjacentText('afterend', JSON.stringify(data));
        document.currentScript.remove();
      }catch(e){}})();`}
    </Script>
  )
}
