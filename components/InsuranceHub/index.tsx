import Link from 'next/link';
import { InsuranceCategoryCard } from '@/components/InsuranceCategoryCard';
import styles from './InsuranceHub.module.css';

interface InsuranceHubProps {
  className?: string;
}

const insuranceCategories = [
  {
    title: '自動車保険',
    description: '対人・対物補償やロードサービスを比較',
    href: '/insurance/compare/auto',
    icon: '🚗',
    color: '#3b82f6',
    features: [
      '対人・対物無制限補償',
      '24時間ロードサービス',
      '弁護士費用特約'
    ],
    avgPrice: '月額 4,500円～',
    companies: 15,
    popular: true
  },
  {
    title: '生命保険',
    description: '死亡保障や医療特約を比較',
    href: '/insurance/compare/life',
    icon: '🛡️',
    color: '#10b981',
    features: [
      '死亡保障 1,000万円～',
      '医療特約付き',
      '解約返戻金あり'
    ],
    avgPrice: '月額 8,000円～',
    companies: 12
  },
  {
    title: '医療保険',
    description: '入院・手術給付金を比較',
    href: '/insurance/compare/medical',
    icon: '🏥',
    color: '#f59e0b',
    features: [
      '入院日額 5,000円～',
      '手術給付金 10万円～',
      '通院保障対応'
    ],
    avgPrice: '月額 2,500円～',
    companies: 18
  },
  {
    title: '火災保険',
    description: '住宅・家財の補償を比較',
    href: '/insurance/compare/fire',
    icon: '🏠',
    color: '#ef4444',
    features: [
      '建物・家財補償',
      '水災・風災対応',
      '個人賠償責任付き'
    ],
    avgPrice: '年額 15,000円～',
    companies: 10
  },
  {
    title: '地震保険',
    description: '地震・津波・噴火による損害を補償',
    href: '/insurance/compare/earthquake',
    icon: '⛰️',
    color: '#8b5cf6',
    features: [
      '地震・津波・噴火補償',
      '火災保険とセット加入',
      '政府と民間の共同制度'
    ],
    avgPrice: '年額 25,000円～',
    companies: 8
  },
  {
    title: 'ペット保険',
    description: 'ペットの医療費を補償',
    href: '/insurance/compare/pet',
    icon: '🐕',
    color: '#06b6d4',
    features: [
      '通院・入院・手術補償',
      '補償割合 50%～90%',
      'ワクチン・健康診断割引'
    ],
    avgPrice: '月額 1,500円～',
    companies: 6
  }
];

const quickActions = [
  {
    title: '保険料試算',
    description: '簡単見積もりで保険料をチェック',
    href: '/insurance/calculator',
    icon: '🧮',
    color: '#3b82f6'
  },
  {
    title: '保険相談',
    description: '専門家に無料で相談',
    href: '/insurance/consultation',
    icon: '💬',
    color: '#10b981'
  },
  {
    title: '保険証券確認',
    description: '現在の契約内容を確認',
    href: '/insurance/check',
    icon: '📋',
    color: '#f59e0b'
  },
  {
    title: '保険金請求',
    description: '事故時の請求手続きガイド',
    href: '/insurance/claim',
    icon: '📞',
    color: '#ef4444'
  }
];

export function InsuranceHub({ className = '' }: InsuranceHubProps) {
  return (
    <div className={`${styles.hub} ${className}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            あなたに最適な保険を見つけよう
          </h1>
          <p className={styles.heroDescription}>
            専門家監修の比較ガイドで、ライフスタイルに合った保険を簡単に選べます。
            月額保険料から補償内容まで、わかりやすく比較できます。
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>保険会社</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>6</span>
              <span className={styles.statLabel}>保険カテゴリ</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>無料</span>
              <span className={styles.statLabel}>比較・相談</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>すぐにできること</h2>
        <div className={styles.quickGrid}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={styles.quickCard}
              style={{ '--action-color': action.color } as React.CSSProperties}
            >
              <div className={styles.quickIcon}>{action.icon}</div>
              <h3 className={styles.quickTitle}>{action.title}</h3>
              <p className={styles.quickDescription}>{action.description}</p>
              <span className={styles.quickAction}>今すぐ始める →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Insurance Categories */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>保険を比較する</h2>
          <p className={styles.sectionDescription}>
            カテゴリ別に保険を比較して、あなたにぴったりの保険を見つけましょう
          </p>
        </div>
        
        <div className={styles.categoriesGrid}>
          {insuranceCategories.map((category, index) => (
            <InsuranceCategoryCard
              key={index}
              {...category}
            />
          ))}
        </div>
      </section>

      {/* Educational Content */}
      <section className={styles.education}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>保険について学ぶ</h2>
          <p className={styles.sectionDescription}>
            保険の基礎知識から選び方のコツまで、わかりやすく解説
          </p>
        </div>
        
        <div className={styles.educationGrid}>
          <Link href="/insurance/guide/basics" className={styles.educationCard}>
            <div className={styles.educationIcon}>📚</div>
            <h3 className={styles.educationTitle}>保険の基礎知識</h3>
            <p className={styles.educationDescription}>
              保険の仕組みや種類、用語について基本から学べます
            </p>
          </Link>
          
          <Link href="/insurance/guide/selection" className={styles.educationCard}>
            <div className={styles.educationIcon}>🎯</div>
            <h3 className={styles.educationTitle}>保険の選び方</h3>
            <p className={styles.educationDescription}>
              ライフステージ別の最適な保険選択方法を解説
            </p>
          </Link>
          
          <Link href="/insurance/guide/tips" className={styles.educationCard}>
            <div className={styles.educationIcon}>💡</div>
            <h3 className={styles.educationTitle}>節約のコツ</h3>
            <p className={styles.educationDescription}>
              保険料を抑えながら適切な補償を得る方法
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}