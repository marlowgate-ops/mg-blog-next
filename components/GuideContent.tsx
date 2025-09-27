import React from "react";
import s from "./GuideContent.module.css";

export default function GuideContent() {
  return (
    <section className={s.guideSection} id="guide" aria-labelledby="guide-title">
      <div className={s.container}>
        <h2 id="guide-title" className={s.sectionTitle}>
          <span className={s.titleIcon}>📖</span>
          FX・CFD業者選びの完全ガイド
        </h2>
        
        <div className={s.content}>
          <div className={s.introduction}>
            <p className={s.leadText}>
              国内FX・CFD業者は数十社以上存在し、それぞれ異なる特徴を持っています。
              初心者から中級者まで、自分に最適な業者を見つけるための実践的な選び方をご紹介します。
            </p>
          </div>

          <div className={s.section}>
            <h3 className={s.subsectionTitle}>コストと約定品質の見極め方</h3>
            <p className={s.bodyText}>
              多くの投資家が重視するスプレッドですが、名目上の数値だけでは判断できません。
              重要なのは「提示レートの更新頻度」と「約定時のスリッページ」です。
              特に短期売買では、0.1pips狭いスプレッドよりも、安定した約定の方が収益に直結します。
            </p>
            <p className={s.bodyText}>
              実際のコスト計算では、スプレッド、取引手数料、入出金手数料、そしてスワップポイントの4要素を総合的に評価することが大切です。
              例えば、スプレッドは広めでも取引手数料が無料で入出金が迅速な業者の方が、実質的なコストパフォーマンスが高い場合があります。
            </p>
          </div>

          <div className={s.section}>
            <h3 className={s.subsectionTitle}>用途別の賢い使い分け戦略</h3>
            <p className={s.bodyText}>
              「1社ですべてを完結させる」よりも、投資スタイルに応じた使い分けが効率的です。
              デイトレードなら約定スピードとアプリの操作性を重視、スイングトレードならスワップポイントと分析ツールの充実度、
              自動売買なら対応プラットフォーム（MT4/MT5）の安定性を優先しましょう。
            </p>
            <p className={s.bodyText}>
              CFDやバイナリーオプションなど多様な商品を取引する場合は、銘柄数の豊富さと証拠金計算の分かりやすさも判断材料になります。
              初心者は機能がシンプルで直感的な業者から始めて、経験を積んでから高機能な業者を追加するアプローチが安全です。
            </p>
          </div>

          <div className={s.section}>
            <h3 className={s.subsectionTitle}>よくある誤解と対策</h3>
            <p className={s.bodyText}>
              「スプレッドが狭い＝良い業者」という単純な判断は危険です。
              重要な指標発表時や市場の混乱時に、どの程度スプレッドが拡大するか、約定拒否が発生しないかを事前に確認することが重要です。
              多くの業者が提供するデモ口座を活用して、実際の取引環境を体験してから判断しましょう。
            </p>
            <p className={s.bodyText}>
              また、入出金の実務面も見落としがちなポイントです。
              24時間対応と謳っていても、実際は平日のみ、または反映に時間がかかる場合があります。
              特に短期間で複数回の入出金を行う可能性がある方は、この点を重点的にチェックしてください。
            </p>
          </div>

          <div className={s.callToAction}>
            <h3 className={s.ctaTitle}>まずは上位3社で比較検討を</h3>
            <p className={s.ctaText}>
              当サイトのランキング上位3社は、コスト、約定品質、サポート体制の全てでバランスが取れています。
              まずはこれらの業者でデモ取引を行い、ご自身の投資スタイルに最も適した1社をメイン口座として選択し、
              必要に応じてサブ口座を追加することをお勧めします。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}