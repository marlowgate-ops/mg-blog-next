"use client";

import React, { ReactNode } from "react";
import PrimaryCta from "./PrimaryCta";

interface RankingCardProps {
  logo: ReactNode;
  name: string;
  highlights: string[];
  caveats?: string[];
  ctaHref: string;
  badge?: string;
  score?: number;
  subscores?: {
    cost: number;
    reliability: number;
    app: number;
  };
}

export default function RankingCard({
  logo,
  name,
  highlights,
  caveats = [],
  ctaHref,
  badge,
  score,
  subscores,
}: RankingCardProps) {
  return (
    <article className="rankingCard">
      <div className="rankingCard-left">
        <div className="rankingCard-logo">{logo}</div>
        <div className="rankingCard-nameWrapper">
          <h3 className="rankingCard-name">{name}</h3>
          {badge && <span className="badge">{badge}</span>}
          {score && (
            <div className="overallScore">
              総合: <strong>{score.toFixed(1)}/5</strong>
            </div>
          )}
          {subscores && (
            <div className="scoreRows">
              <div className="scoreRow">
                <span className="scoreLabel">コスト</span>
                <div className="scoreBar">
                  <span style={{ '--w': `${(subscores.cost / 5) * 100}%` } as React.CSSProperties}></span>
                </div>
              </div>
              <div className="scoreRow">
                <span className="scoreLabel">信頼性</span>
                <div className="scoreBar">
                  <span style={{ '--w': `${(subscores.reliability / 5) * 100}%` } as React.CSSProperties}></span>
                </div>
              </div>
              <div className="scoreRow">
                <span className="scoreLabel">アプリ</span>
                <div className="scoreBar">
                  <span style={{ '--w': `${(subscores.app / 5) * 100}%` } as React.CSSProperties}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rankingCard-center">
        {highlights.length > 0 && (
          <ul className="rankingCard-highlights">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index}>• {highlight}</li>
            ))}
          </ul>
        )}
        {caveats && caveats.length > 0 && (
          <ul className="rankingCard-caveats">
            {caveats.slice(0, 2).map((caveat, index) => (
              <li key={index}>• {caveat}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="rankingCard-right">
        <PrimaryCta href={ctaHref} />
      </div>

      <style jsx>{`
        .rankingCard {
          display: grid;
          grid-template-columns: minmax(200px, 1fr) minmax(320px, 2fr) 220px;
          align-items: center;
          padding: 16px;
          border-radius: 16px;
          box-shadow: var(--shadow-card);
          background: var(--surface);
          gap: 12px;
        }

        .rankingCard-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rankingCard-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--surface-muted);
          font-weight: 700;
          color: var(--text-strong);
        }

        .rankingCard-nameWrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rankingCard-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
        }

        .badge {
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 9999px;
          background: var(--surface-strong);
          color: var(--text-on-strong);
          font-weight: 500;
        }

        .overallScore {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .scoreRows {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .scoreRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .scoreLabel {
          font-size: 0.75rem;
          color: var(--text-muted);
          min-width: 40px;
          text-align: right;
        }

        .scoreBar {
          height: 6px;
          border-radius: 4px;
          background: var(--surface-weak);
          overflow: hidden;
          min-width: 120px;
        }

        .scoreBar > span {
          display: block;
          height: 100%;
          background: var(--brand);
          width: var(--w, 0%);
        }

        .rankingCard-center {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rankingCard-highlights,
        .rankingCard-caveats {
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 14px;
        }

        .rankingCard-highlights {
          color: var(--text);
        }

        .rankingCard-caveats {
          color: var(--text-muted);
        }

        .rankingCard-highlights li,
        .rankingCard-caveats li {
          margin: 2px 0;
        }

        .rankingCard-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        @media (max-width: 920px) {
          .rankingCard {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .rankingCard-left {
            justify-self: start;
          }

          .rankingCard-center {
            justify-self: start;
          }

          .rankingCard-right {
            justify-self: start;
          }
        }
      `}</style>
    </article>
  );
}