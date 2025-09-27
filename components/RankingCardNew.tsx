"use client";

import React, { ReactNode } from "react";
import PrimaryCta from "./PrimaryCta";
import Badge from "./Badge";
import { getBrokerBadges, getEvaluationMeta } from "@/lib/evaluation";
import s from "@/app/best/layout.module.css";

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
    <article className={s.rankingCard}>
      <div className={s.rankingCard_left}>
        <div className={s.rankingCard_logo}>{logo}</div>
        <div className={s.rankingCard_nameWrapper}>
          <h3 className={s.rankingCard_name}>{name}</h3>
          {badge && <span className={s.badge}>{badge}</span>}
          {score && (
            <div className={s.overallScore}>
              総合: <strong>{score.toFixed(1)}/5</strong>
            </div>
          )}
          {subscores && (
            <div className={s.scoreRows}>
              <div className={s.scoreRow}>
                <span className={s.scoreLabel}>コスト</span>
                <div className={s.scoreBar}>
                  <span
                    style={
                      {
                        "--w": `${(subscores.cost / 5) * 100}%`,
                      } as React.CSSProperties
                    }
                  ></span>
                </div>
              </div>
              <div className={s.scoreRow}>
                <span className={s.scoreLabel}>信頼性</span>
                <div className={s.scoreBar}>
                  <span
                    style={
                      {
                        "--w": `${(subscores.reliability / 5) * 100}%`,
                      } as React.CSSProperties
                    }
                  ></span>
                </div>
              </div>
              <div className={s.scoreRow}>
                <span className={s.scoreLabel}>アプリ</span>
                <div className={s.scoreBar}>
                  <span
                    style={
                      {
                        "--w": `${(subscores.app / 5) * 100}%`,
                      } as React.CSSProperties
                    }
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={s.rankingCard_center}>
        {highlights.length > 0 && (
          <ul className={s.rankingCard_highlights}>
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index}>• {highlight}</li>
            ))}
          </ul>
        )}
        {caveats && caveats.length > 0 && (
          <ul className={s.rankingCard_caveats}>
            {caveats.slice(0, 2).map((caveat, index) => (
              <li key={index}>• {caveat}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={s.rankingCard_right}>
        <PrimaryCta href={ctaHref} />
        {score && (
          <div className={s.badgeList}>
            {getBrokerBadges(score).map((badgeKey) => {
              const meta = getEvaluationMeta();
              const badgeInfo = meta.badges?.[badgeKey];
              if (!badgeInfo || !badgeInfo.label || !badgeInfo.description) return null;
              
              return (
                <Badge
                  key={badgeKey}
                  badge={badgeKey}
                  label={badgeInfo.label}
                  description={badgeInfo.description}
                  variant="primary"
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
