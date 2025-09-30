import RegulatorBadge from './RegulatorBadge';
import s from './KeyFacts.module.css';

interface KeyFactsProps {
  country: string;
  regulators: string[];
  safetyScore: number;
  platforms: string[];
  funding: string[];
}

export default function KeyFacts({ country, regulators, safetyScore, platforms, funding }: KeyFactsProps) {
  return (
    <div className={s.keyFacts}>
      <h2 className={s.title}>基本情報</h2>
      
      <div className={s.grid}>
        <div className={s.section}>
          <h3 className={s.sectionTitle}>規制・安全性</h3>
          <div className={s.item}>
            <span className={s.label}>本社所在地:</span>
            <span className={s.value}>{country}</span>
          </div>
          <div className={s.item}>
            <span className={s.label}>規制機関:</span>
            <div className={s.regulators}>
              {regulators.map((regulator, index) => (
                <RegulatorBadge key={index} name={regulator} />
              ))}
            </div>
          </div>
          <div className={s.item}>
            <span className={s.label}>安全性スコア:</span>
            <div className={s.safetyScore}>
              <span className={`${s.score} ${getSafetyClass(safetyScore)}`}>
                {safetyScore}/100
              </span>
              <span className={s.safetyLabel}>
                {getSafetyLabel(safetyScore)}
              </span>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h3 className={s.sectionTitle}>取引環境</h3>
          <div className={s.item}>
            <span className={s.label}>取引プラットフォーム:</span>
            <div className={s.platforms}>
              {platforms.map((platform, index) => (
                <span key={index} className={s.platform}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div className={s.item}>
            <span className={s.label}>入金方法:</span>
            <div className={s.funding}>
              {funding.map((method, index) => (
                <span key={index} className={s.fundingMethod}>
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSafetyClass(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'fair';
  return 'poor';
}

function getSafetyLabel(score: number): string {
  if (score >= 90) return '非常に安全';
  if (score >= 80) return '安全';
  if (score >= 70) return '普通';
  return '要注意';
}