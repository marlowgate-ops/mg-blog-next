import { faqs } from "@/data/faqs";
import JsonLd from "@/components/JsonLd";

function faqJSONLD() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(x => ({
      "@type": "Question",
      "name": x.q,
      "acceptedAnswer": { "@type": "Answer", "text": x.a }
    }))
  };
}

export default function FAQ() {
  const data = faqJSONLD();
  return (
    <section aria-labelledby="faq" style={{marginTop:24}}>
      <JsonLd data={data} />
      <h2 id="faq" style={{fontSize:18,margin:"12px 0"}}>よくある質問</h2>
      <div style={{display:"grid",gap:10}}>
        {faqs.map((x,i)=>(
          <details key={i} style={{padding:"10px 12px",border:"1px solid #e5e7eb",borderRadius:12,background:"#fff"}}>
            <summary style={{cursor:"pointer",fontWeight:600}}>{x.q}</summary>
            <div style={{color:"#334155",marginTop:6}}>{x.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
