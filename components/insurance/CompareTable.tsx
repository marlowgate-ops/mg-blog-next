'use client';
import { useState } from 'react';
import s from './CompareTable.module.css';

interface InsuranceItem {
  title: string;
  provider: string;
  ratingValue: number;
  priceNote?: string;
  pros: string[];
  cons: string[];
  ctaLabel: string;
  ctaUrl: string;
}

export default function CompareTable({ items }: { items: InsuranceItem[] }) {
  const [selectedItems, setSelectedItems] = useState<number[]>([0, 1, 2]);

  const toggleSelection = (index: number) => {
    if (selectedItems.includes(index)) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter(i => i !== index));
      }
    } else {
      if (selectedItems.length < 4) {
        setSelectedItems([...selectedItems, index]);
      }
    }
  };

  const compareItems = selectedItems.map(index => items[index]).filter(Boolean);

  return (
    <div className={s.container}>
      <div className={s.selector}>
        <h3 className={s.selectorTitle}>比較する保険を選択（最大4つ）</h3>
        <div className={s.itemGrid}>
          {items.map((item, index) => (
            <label key={index} className={s.itemCheckbox}>
              <input
                type="checkbox"
                checked={selectedItems.includes(index)}
                onChange={() => toggleSelection(index)}
                disabled={!selectedItems.includes(index) && selectedItems.length >= 4}
              />
              <span className={s.checkboxLabel}>
                {item.title}
                <small>（{item.provider}）</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.fixedColumn}>項目</th>
              {compareItems.map((item, index) => (
                <th key={index} className={s.itemColumn}>
                  <div className={s.itemHeader}>
                    <div className={s.itemTitle}>{item.title}</div>
                    <div className={s.itemProvider}>{item.provider}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={s.fixedColumn}>評価</td>
              {compareItems.map((item, index) => (
                <td key={index} className={s.itemColumn}>
                  <div className={s.rating}>
                    ★{item.ratingValue}/5.0
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={s.fixedColumn}>保険料目安</td>
              {compareItems.map((item, index) => (
                <td key={index} className={s.itemColumn}>
                  <div className={s.price}>
                    {item.priceNote || '要見積もり'}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className={s.fixedColumn}>主な特徴</td>
              {compareItems.map((item, index) => (
                <td key={index} className={s.itemColumn}>
                  <ul className={s.featureList}>
                    {item.pros.slice(0, 3).map((pro, proIndex) => (
                      <li key={proIndex} className={s.featureItem}>
                        ✓ {pro}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className={s.fixedColumn}>注意点</td>
              {compareItems.map((item, index) => (
                <td key={index} className={s.itemColumn}>
                  <ul className={s.cautionList}>
                    {item.cons.slice(0, 2).map((con, conIndex) => (
                      <li key={conIndex} className={s.cautionItem}>
                        ⚠ {con}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className={s.fixedColumn}>申込み</td>
              {compareItems.map((item, index) => (
                <td key={index} className={s.itemColumn}>
                  <a 
                    href={item.ctaUrl}
                    className={s.ctaButton}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.ctaLabel}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className={s.mobileCards}>
        {compareItems.map((item, index) => (
          <div key={index} className={s.mobileCard}>
            <div className={s.mobileHeader}>
              <h4 className={s.mobileTitle}>{item.title}</h4>
              <div className={s.mobileProvider}>{item.provider}</div>
              <div className={s.mobileRating}>★{item.ratingValue}/5.0</div>
            </div>
            
            <div className={s.mobileSection}>
              <h5>保険料目安</h5>
              <p>{item.priceNote || '要見積もり'}</p>
            </div>

            <div className={s.mobileSection}>
              <h5>主な特徴</h5>
              <ul className={s.mobileFeatureList}>
                {item.pros.slice(0, 3).map((pro, proIndex) => (
                  <li key={proIndex}>✓ {pro}</li>
                ))}
              </ul>
            </div>

            <div className={s.mobileSection}>
              <h5>注意点</h5>
              <ul className={s.mobileCautionList}>
                {item.cons.slice(0, 2).map((con, conIndex) => (
                  <li key={conIndex}>⚠ {con}</li>
                ))}
              </ul>
            </div>

            <div className={s.mobileSection}>
              <a 
                href={item.ctaUrl}
                className={s.mobileCtaButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.ctaLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}