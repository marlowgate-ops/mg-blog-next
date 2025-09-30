import Link from 'next/link';
import RatingStars from './RatingStars';
import RegulatorBadge from './RegulatorBadge';
import s from './BrokerCompareTable.module.css';

interface Broker {
  name: string;
  slug: string;
  url: string;
  country: string;
  regulators: string[];
  safetyScore: number;
  spreads: {
    majorPairs: Record<string, number>;
  };
  feesNote: string;
  platforms: string[];
  funding: string[];
  pros: string[];
  cons: string[];
  ratingValue: number;
  ratingCount: number;
  ctaLabel: string;
  ctaUrl: string;
}

interface BrokerCompareTableProps {
  brokers: Broker[];
}

export default function BrokerCompareTable({ brokers }: BrokerCompareTableProps) {
  if (brokers.length === 0) {
    return (
      <div className={s.empty}>
        <p>比較するブローカーを選択してください。</p>
      </div>
    );
  }

  const formatSpread = (spread: number, pair: string): string => {
    const isJpyPair = pair.includes('JPY');
    const unit = isJpyPair ? '銭' : 'pips';
    return `${spread}${unit}`;
  };

  const getSpreadClass = (spread: number): string => {
    if (spread <= 0.3) return 'excellent';
    if (spread <= 0.7) return 'good';
    if (spread <= 1.0) return 'fair';
    return 'poor';
  };

  const majorPairs = ['USDJPY', 'EURUSD', 'GBPUSD', 'AUDUSD', 'EURJPY'];

  return (
    <div className={s.compareTable}>
      {/* Mobile: Tab View */}
      <div className={s.mobileView}>
        <div className={s.tabs}>
          {brokers.map((broker, index) => (
            <button
              key={broker.slug}
              className={`${s.tab} ${index === 0 ? s.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                // Mobile tab switching logic
                const tabs = document.querySelectorAll(`.${s.tab}`);
                const contents = document.querySelectorAll(`.${s.tabContent}`);
                
                tabs.forEach(tab => tab.classList.remove(s.active));
                contents.forEach(content => content.classList.remove(s.active));
                
                e.currentTarget.classList.add(s.active);
                document.getElementById(`tab-${broker.slug}`)?.classList.add(s.active);
              }}
            >
              {broker.name}
            </button>
          ))}
        </div>
        
        {brokers.map((broker, index) => (
          <div
            key={broker.slug}
            id={`tab-${broker.slug}`}
            className={`${s.tabContent} ${index === 0 ? s.active : ''}`}
          >
            <BrokerCard broker={broker} />
          </div>
        ))}
      </div>

      {/* Desktop: Table View */}
      <div className={s.desktopView}>
        <div className={s.stickyColumn}>
          <div className={s.rowHeader}>ブローカー</div>
          <div className={s.rowHeader}>総合評価</div>
          <div className={s.rowHeader}>安全性</div>
          <div className={s.rowHeader}>規制機関</div>
          <div className={s.rowHeader}>スプレッド</div>
          {majorPairs.map(pair => (
            <div key={pair} className={s.subRowHeader}>
              {pair.replace(/(.{3})(.{3})/, '$1/$2')}
            </div>
          ))}
          <div className={s.rowHeader}>取引ツール</div>
          <div className={s.rowHeader}>入金方法</div>
          <div className={s.rowHeader}>手数料</div>
          <div className={s.rowHeader}>メリット</div>
          <div className={s.rowHeader}>デメリット</div>
          <div className={s.rowHeader}>口座開設</div>
        </div>

        <div className={s.dataColumns}>
          {brokers.map((broker) => (
            <div key={broker.slug} className={s.dataColumn}>
              {/* Broker Name */}
              <div className={s.dataCell}>
                <Link href={broker.url} className={s.brokerLink}>
                  <h3 className={s.brokerName}>{broker.name}</h3>
                </Link>
              </div>

              {/* Rating */}
              <div className={s.dataCell}>
                <RatingStars 
                  value={broker.ratingValue} 
                  count={broker.ratingCount} 
                  size="small"
                  showCount={false}
                />
              </div>

              {/* Safety Score */}
              <div className={s.dataCell}>
                <span className={`${s.safetyScore} ${getSafetyClass(broker.safetyScore)}`}>
                  {broker.safetyScore}/100
                </span>
              </div>

              {/* Regulators */}
              <div className={s.dataCell}>
                <div className={s.regulators}>
                  {broker.regulators.slice(0, 2).map((regulator, index) => (
                    <RegulatorBadge key={index} name={regulator} />
                  ))}
                  {broker.regulators.length > 2 && (
                    <span className={s.moreRegulators}>+{broker.regulators.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Spreads Header */}
              <div className={s.dataCell}>
                <span className={s.spreadsHeader}>主要通貨ペア</span>
              </div>

              {/* Individual Spreads */}
              {majorPairs.map(pair => {
                const spread = broker.spreads.majorPairs[pair];
                return (
                  <div key={pair} className={s.subDataCell}>
                    {spread ? (
                      <span className={`${s.spreadValue} ${s[getSpreadClass(spread)]}`}>
                        {formatSpread(spread, pair)}
                      </span>
                    ) : (
                      <span className={s.noData}>-</span>
                    )}
                  </div>
                );
              })}

              {/* Platforms */}
              <div className={s.dataCell}>
                <div className={s.platforms}>
                  {broker.platforms.slice(0, 2).map((platform, index) => (
                    <span key={index} className={s.platform}>{platform}</span>
                  ))}
                  {broker.platforms.length > 2 && (
                    <span className={s.morePlatforms}>+{broker.platforms.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Funding */}
              <div className={s.dataCell}>
                <div className={s.funding}>
                  {broker.funding.slice(0, 2).map((method, index) => (
                    <span key={index} className={s.fundingMethod}>{method}</span>
                  ))}
                  {broker.funding.length > 2 && (
                    <span className={s.moreFunding}>+{broker.funding.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Fees */}
              <div className={s.dataCell}>
                <div className={s.feesNote}>
                  {broker.feesNote.length > 50 
                    ? `${broker.feesNote.substring(0, 50)}...`
                    : broker.feesNote
                  }
                </div>
              </div>

              {/* Pros */}
              <div className={s.dataCell}>
                <ul className={s.prosList}>
                  {broker.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className={s.prosItem}>✓ {pro}</li>
                  ))}
                  {broker.pros.length > 3 && (
                    <li className={s.morePros}>+{broker.pros.length - 3}個</li>
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className={s.dataCell}>
                <ul className={s.consList}>
                  {broker.cons.slice(0, 3).map((con, index) => (
                    <li key={index} className={s.consItem}>✗ {con}</li>
                  ))}
                  {broker.cons.length > 3 && (
                    <li className={s.moreCons}>+{broker.cons.length - 3}個</li>
                  )}
                </ul>
              </div>

              {/* CTA */}
              <div className={s.dataCell}>
                <a
                  href={broker.ctaUrl}
                  target="_blank"
                  rel="nofollow sponsored"
                  className={s.ctaButton}
                  onClick={() => {
                    // GA4 event
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'broker_outbound_click', {
                        broker_name: broker.name,
                        source: 'compare_table'
                      });
                    }
                  }}
                >
                  {broker.ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <div className={s.brokerCard}>
      <div className={s.cardHeader}>
        <Link href={broker.url} className={s.cardTitle}>
          <h3>{broker.name}</h3>
        </Link>
        <RatingStars 
          value={broker.ratingValue} 
          count={broker.ratingCount} 
          size="small"
        />
      </div>

      <div className={s.cardGrid}>
        <div className={s.cardSection}>
          <h4 className={s.cardSectionTitle}>安全性・規制</h4>
          <div className={s.cardItem}>
            <span className={s.cardLabel}>安全性スコア:</span>
            <span className={`${s.safetyScore} ${getSafetyClass(broker.safetyScore)}`}>
              {broker.safetyScore}/100
            </span>
          </div>
          <div className={s.cardItem}>
            <span className={s.cardLabel}>規制機関:</span>
            <div className={s.regulators}>
              {broker.regulators.map((regulator, index) => (
                <RegulatorBadge key={index} name={regulator} />
              ))}
            </div>
          </div>
        </div>

        <div className={s.cardSection}>
          <h4 className={s.cardSectionTitle}>主要スプレッド</h4>
          {Object.entries(broker.spreads.majorPairs).slice(0, 3).map(([pair, spread]) => (
            <div key={pair} className={s.cardItem}>
              <span className={s.cardLabel}>{pair.replace(/(.{3})(.{3})/, '$1/$2')}:</span>
              <span className={`${s.spreadValue} ${s[getSpreadClass(spread)]}`}>
                {formatSpread(spread, pair)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.cardFooter}>
        <a
          href={broker.ctaUrl}
          target="_blank"
          rel="nofollow sponsored"
          className={s.cardCta}
          onClick={() => {
            // GA4 event
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'broker_outbound_click', {
                broker_name: broker.name,
                source: 'compare_card'
              });
            }
          }}
        >
          {broker.ctaLabel}
        </a>
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

function formatSpread(spread: number, pair: string): string {
  const isJpyPair = pair.includes('JPY');
  const unit = isJpyPair ? '銭' : 'pips';
  return `${spread}${unit}`;
}

function getSpreadClass(spread: number): string {
  if (spread <= 0.3) return 'excellent';
  if (spread <= 0.7) return 'good';
  if (spread <= 1.0) return 'fair';
  return 'poor';
}