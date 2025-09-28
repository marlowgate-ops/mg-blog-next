import Link from 'next/link';
import CardLink from './CardLink';
import SectionTitle from './SectionTitle';
import s from './ContentBlocks.module.css';

const guidesData = [
  {
    title: '口座開設ガイド',
    description: 'FX・CFD業者の口座開設手順を詳しく解説',
    href: '/guides/account-opening',
  },
  {
    title: 'FX・CFD業者選びの完全ガイド',
    description: '初心者から中級者まで、自分に最適な業者を見つける方法',
    href: '/best/forex-brokers-jp#guide',
  },
  {
    title: 'リスク管理の基本',
    description: '投資におけるリスク管理の重要性と実践方法',
    href: '/guides/risk-management',
  },
];

const reviewsData = [
  {
    title: 'DMM証券レビュー',
    description: '使いやすさと約定品質を検証',
    href: '/reviews/dmm',
  },
  {
    title: 'FXTF証券レビュー',
    description: 'スプレッドと取引環境を詳細分析',
    href: '/reviews/fxtf',
  },
  {
    title: '松井証券レビュー',
    description: '老舗証券会社の FX サービスを評価',
    href: '/reviews/matsui',
  },
];

const comparisonsData = [
  {
    title: 'FX・CFD業者ランキング',
    description: '総合評価による国内業者比較',
    href: '/best/forex-brokers-jp',
  },
  {
    title: '低スプレッド業者比較',
    description: 'コスト重視の業者選び',
    href: '/best/low-spread',
  },
  {
    title: 'アプリ・ツール比較',
    description: '取引ツールの使いやすさを比較',
    href: '/best/tools',
  },
];

const insuranceData = [
  {
    title: '保険比較トップ',
    description: '生命保険・医療保険・自動車保険を比較',
    href: '/best/insurance',
  },
  {
    title: '自動車保険',
    description: '自動車保険の選び方と比較',
    href: '/best/insurance/car',
  },
  {
    title: '生命保険',
    description: '生命保険の基本と選び方',
    href: '/best/insurance/life',
  },
  {
    title: '医療保険',
    description: '医療保険の比較とおすすめ',
    href: '/best/insurance/medical',
  },
];

interface ContentBlockProps {
  onCardClick?: (section: string, target: string) => void;
}

export default function ContentBlocks({ onCardClick }: ContentBlockProps) {
  const handleCardClick = (section: string, href: string, title: string) => {
    if (onCardClick) {
      onCardClick(section, `${title} (${href})`);
    }
  };

  return (
    <div className={s.contentBlocks}>
      {/* Guides Section */}
      <section className={s.section}>
        <SectionTitle>Guides</SectionTitle>
        <div className={s.cardGrid}>
          {guidesData.map((guide) => (
            <CardLink
              key={guide.href}
              href={guide.href}
              title={guide.title}
              description={guide.description}
              icon="📚"
              onClick={() => handleCardClick('guides', guide.href, guide.title)}
            />
          ))}
        </div>
        <Link href="/guides" className={s.sectionLink}>
          すべてのガイドを見る →
        </Link>
      </section>

      {/* Reviews Section */}
      <section className={s.section}>
        <SectionTitle>Reviews</SectionTitle>
        <div className={s.cardGrid}>
          {reviewsData.map((review) => (
            <CardLink
              key={review.href}
              href={review.href}
              title={review.title}
              description={review.description}
              icon="⭐"
              onClick={() => handleCardClick('reviews', review.href, review.title)}
            />
          ))}
        </div>
        <Link href="/reviews" className={s.sectionLink}>
          すべてのレビューを見る →
        </Link>
      </section>

      {/* Comparisons Section */}
      <section className={s.section}>
        <SectionTitle>Comparisons</SectionTitle>
        <div className={s.cardGrid}>
          {comparisonsData.map((comparison) => (
            <CardLink
              key={comparison.href}
              href={comparison.href}
              title={comparison.title}
              description={comparison.description}
              icon="⚖️"
              onClick={() => handleCardClick('comparisons', comparison.href, comparison.title)}
            />
          ))}
        </div>
        <Link href="/best" className={s.sectionLink}>
          すべての比較を見る →
        </Link>
      </section>

      {/* Insurance Section */}
      <section className={s.section}>
        <SectionTitle>Insurance</SectionTitle>
        <div className={s.cardGrid}>
          {insuranceData.map((insurance) => (
            <CardLink
              key={insurance.href}
              href={insurance.href}
              title={insurance.title}
              description={insurance.description}
              icon="🛡️"
              onClick={() => handleCardClick('insurance', insurance.href, insurance.title)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}