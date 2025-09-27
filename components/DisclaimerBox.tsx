import React from "react";
import s from "./DisclaimerBox.module.css";

export default function DisclaimerBox() {
  return (
    <section className={s.disclaimerSection} id="disclaimer" aria-labelledby="disclaimer-title">
      <div className={s.container}>
        <h2 id="disclaimer-title" className={s.sectionTitle}>
          <span className={s.titleIcon}>⚠️</span>
          免責事項
        </h2>
        
        <div className={s.disclaimerBox}>
          <div className={s.content}>
            <div className={s.item}>
              <h3 className={s.itemTitle}>投資リスクについて</h3>
              <p className={s.itemText}>
                FX・CFD取引は元本や利益を保証するものではありません。相場変動により損失が生じる可能性があります。
                取引前にリスクを十分理解し、余裕資金の範囲内で投資判断を行ってください。
              </p>
            </div>
            
            <div className={s.item}>
              <h3 className={s.itemTitle}>情報の正確性について</h3>
              <p className={s.itemText}>
                当サイトの情報は編集部が独自に収集・検証していますが、すべての情報の正確性・完全性を保証するものではありません。
                最新の条件や詳細は各業者の公式サイトでご確認ください。
              </p>
            </div>
            
            <div className={s.item}>
              <h3 className={s.itemTitle}>広告・アフィリエイトについて</h3>
              <p className={s.itemText}>
                当サイトには広告リンクが含まれており、ご利用により収益を得る場合があります。
                ただし、評価内容は広告収益に影響されることなく、編集部の独自基準に基づいて作成しています。
              </p>
            </div>
          </div>
          
          <div className={s.footer}>
            <p className={s.footerText}>
              取引開始前に各業者の契約条件、リスク説明書を必ずお読みください。
              ご不明な点は各業者のカスタマーサポートまでお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}