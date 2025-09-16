'use client'
import Link from 'next/link'
import styles from '../best.module.css'
import Stars from '@/components/Stars'
import AffLink from '@/components/AffLink'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useMemo } from 'react'

type Broker = { key:string; name:string; score:number; status:'live'|'prep'; account:string; platform:string; cost:string; note:string; link?:string }

const logos: Record<string,string> = {
  'dmm':'DMM',
  'fxtf':'FXTF',
  'matsui':'松',
  'gmoclick':'G'
}

function Logo({code}:{code:string}){
  const txt = logos[code] || code.slice(0,2).toUpperCase()
  return <span className={styles.logo} aria-hidden="true">{txt}</span>
}

function Card({code,name,score,pros=[],cons=[],href,status}:{code:string;name:string;score:number;pros?:string[];cons?:string[];href?:string;status:'live'|'prep'}){
  const showCTA = status==='live' && !!href
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardTitle}><Logo code={code}/>{name}{status==='prep'?<span className={styles.prep}>準備中</span>:null}</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Stars score={score}/>
          <div style={{fontSize:12,color:'#6b7280'}}>{score}/100</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div>
          <div style={{fontSize:12,color:'#6b7280'}}>良い点</div>
          <ul style={{margin:0,paddingLeft:18}}>{pros.map((p,i)=><li key={i}>{p}</li>)}</ul>
        </div>
        <div>
          <div style={{fontSize:12,color:'#6b7280'}}>注意点</div>
          <ul style={{margin:0,paddingLeft:18}}>{cons.map((p,i)=><li key={i}>{p}</li>)}</ul>
        </div>
      </div>
      {showCTA ? <div><AffLink className={styles.cta} href={href!} gaLabel={`card-${name}`}>公式サイトで口座開設</AffLink></div> : null}
    </div>
  )
}

function Table({rows}:{rows:Broker[]}){
  return (
    <div id="specs" className={styles.tableWrap}>
      <table className={styles.tbl} role="table">
        <thead>
          <tr>
            <th>業者</th>
            <th>編集スコア</th>
            <th>口座/商品</th>
            <th>プラットフォーム</th>
            <th>コスト</th>
            <th>備考</th>
            <th>口座開設</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={r.key}>
              <td><Logo code={r.key}/> {r.name} {r.status==='prep' && <span className={styles.prep}>準備中</span>}</td>
              <td><Stars score={r.score}/></td>
              <td>{r.account}</td>
              <td>{r.platform}</td>
              <td>{r.cost}</td>
              <td>{r.note}</td>
              <td>{(r.status==='live' && r.link) ? <AffLink className={styles.cta} href={r.link} gaLabel={`table-${r.name}`}>公式サイトで口座開設</AffLink> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FAQ(){
  const items=[
    {q:'初心者はどれから見れば良い？', a:'まずは国内サービスの口座（例：DMM.com証券）を1社開設し、少額で出し入れの動作を確認してから比較検討するのが安全です。'},
    {q:'ランキングの序列は？', a:'表示の順序やスコアは編集部判断です。料金や条件は変動します。最新は各公式をご確認ください。'},
    {q:'海外業者も扱いますか？', a:'現状は国内中心。要望が多ければ別ページで比較します。'}
  ]
  return (
    <div id="faq" className={styles.faq}>
      {items.map((it,i)=>(
        <details key={i} className={styles.faqItem}>
          <summary className={styles.faqQ}>{it.q}</summary>
          <div className={styles.faqA}>{it.a}</div>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context':'https://schema.org',
        '@type':'FAQPage',
        mainEntity: items.map(x=>({ '@type':'Question', name:x.q, acceptedAnswer:{ '@type':'Answer', text:x.a }}))
      })}}/>
    </div>
  )
}

export default function Page(){
  const DMM = process.env.NEXT_PUBLIC_AFF_DMM || ''
  const FXTF = process.env.NEXT_PUBLIC_AFF_FXTF || ''

  const rows:Broker[] = [
    { key:'dmm', name:'DMM.com証券', score:88, status:'live', account:'FX / CFD / 株', platform:'Web / アプリ', cost:'編集評価', note:'—', link:DMM || undefined },
    { key:'matsui', name:'松井証券（準備中）', score:0, status:'prep', account:'—', platform:'—', cost:'—', note:'—' },
    { key:'gmoclick', name:'GMOクリック証券（準備中）', score:0, status:'prep', account:'—', platform:'—', cost:'—', note:'—' },
    { key:'fxtf', name:'ゴールデンウェイ・ジャパン（FXTF）', score:0, status:'prep', account:'FX', platform:'Web / アプリ', cost:'—', note:'—', link:FXTF || undefined },
  ]

  const itemListLD = useMemo(()=>{
    const list = rows.map((r,idx)=>({ '@type':'ListItem', position: idx+1, name: r.name }))
    return { '@context':'https://schema.org', '@type':'ItemList', itemListElement: list }
  },[rows])

  return (
    <main className={styles.container}>
      <div className={styles.badgePr}>PR</div>
      <Breadcrumbs items={[
        {name:'ホーム', href:'/'}, {name:'比較', href:'/best'}, {name:'国内向けFX・CFD'}
      ]}/>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>【2025年版】 国内向けおすすめFX・CFD業者ランキング</h1>
        <p className={styles.heroLead}>初心者〜中級まで乗換が安定する、<b>国内サービス</b>を中心に選ぶ。評価軸は「スプレッド/手数料・約定・入出金・サポート」。</p>
        <div className={styles.anchorNav}>
          <a href="#rank">総合ランキング</a>
          <a href="#specs">主要スペック比較</a>
          <a href="#faq">よくある質問</a>
        </div>
      </section>

      <section id="rank" className={styles.cards}>
        <Card code="dmm" name="DMM.com証券" score={88}
          pros={['国内大手の信頼感','約定スピードに定評','初心者向けUI']}
          cons={['キャンペーン期は条件要確認']}
          href={DMM} status="live"/>
        <Card code="matsui" name="松井証券（準備中）" score={0}
          pros={['準備中']} cons={['準備中']} status="prep"/>
        <Card code="fxtf" name="ゴールデンウェイ・ジャパン（FXTF）" score={0}
          pros={['評価準備中']} cons={['—']} status="prep"/>
      </section>

      <h2 style={{margin:'18px 0 8px 0'}}>主要スペック比較</h2>
      <Table rows={rows}/>

      <h2 style={{margin:'18px 0 8px 0'}}>よくある質問</h2>
      <FAQ/>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemListLD)}}/>
      <p className={styles.note}>表示の順序やスコアは編集部判断です。料金や条件は変動します。最新は各公式をご確認ください。</p>
    </main>
  )
}
