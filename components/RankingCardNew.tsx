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
}

export default function RankingCard({
  logo,
  name,
  highlights,
  caveats = [],
  ctaHref,
  badge,
}: RankingCardProps) {
  return (
    <article className="rankingCard">
      <div className="rankingCard-left">
        <div className="rankingCard-logo">{logo}</div>
        <div className="rankingCard-nameWrapper">
          <h3 className="rankingCard-name">{name}</h3>
          {badge && <span className="badge">{badge}</span>}
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