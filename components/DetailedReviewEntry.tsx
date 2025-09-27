import React from 'react';
import Link from 'next/link';
import reviewsData from '@/content_source/detailed/reviews.json';
import s from './DetailedReviewEntry.module.css';

interface DetailedReviewEntryProps {
  limit?: number;
  className?: string;
}

interface ReviewData {
  id: string;
  title: string;
  route: string;
  summary: {
    overall: string;
    strengths: string[];
    cautions: string[];
    bestFor: string;
  };
}

export default function DetailedReviewEntry({ 
  limit = 2, 
  className = '' 
}: DetailedReviewEntryProps) {
  const reviews = (reviewsData as ReviewData[]).slice(0, limit);
  
  if (reviews.length === 0) return null;

  return (
    <div className={`${s.detailedReviews} ${className}`}>
      <h3 className={s.reviewsHeading}>詳細レビュー</h3>
      <p className={s.reviewsDescription}>
        実際の取引環境・サポート品質・手数料体系を検証したレビューです。
      </p>
      
      <div className={s.reviewsGrid}>
        {reviews.map((review) => (
          <div key={review.id} className={s.reviewCard}>
            <div className={s.reviewHeader}>
              <h4 className={s.reviewTitle}>
                <Link href={review.route} className={s.reviewLink}>
                  {review.title}
                </Link>
              </h4>
              <p className={s.reviewOverall}>{review.summary.overall}</p>
            </div>
            
            <div className={s.reviewDetails}>
              <div className={s.reviewSection}>
                <strong className={s.sectionLabel}>強み:</strong>
                <ul className={s.reviewBullets}>
                  {review.summary.strengths.slice(0, 2).map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className={s.reviewSection}>
                <strong className={s.sectionLabel}>注意点:</strong>
                <ul className={s.reviewBullets}>
                  {review.summary.cautions.slice(0, 1).map((caution, index) => (
                    <li key={index}>{caution}</li>
                  ))}
                </ul>
              </div>
              
              <div className={s.reviewSection}>
                <strong className={s.sectionLabel}>最適:</strong>
                <span className={s.bestFor}>{review.summary.bestFor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}