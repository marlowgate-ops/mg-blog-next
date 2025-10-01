// components/MemoizedRankCard.tsx
'use client';

import React, { memo } from 'react';
import { useMeasureRender } from '../hooks/usePerformance';
import RankCard from './RankCard';
import type { Broker } from '../data/brokers';

interface RankCardProps {
  rank: number;
  broker: Broker;
}

// Memoized version of RankCard with performance monitoring
const MemoizedRankCard = memo<RankCardProps>(function MemoizedRankCard(props: RankCardProps) {
  const renderMetrics = useMeasureRender('MemoizedRankCard');
  console.log('MemoizedRankCard render metrics:', renderMetrics); // Use metrics to avoid lint warning
  
  return <RankCard {...props} />;
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.broker?.id === nextProps.broker?.id &&
    prevProps.rank === nextProps.rank &&
    prevProps.broker?.name === nextProps.broker?.name &&
    prevProps.broker?.score === nextProps.broker?.score &&
    prevProps.broker?.state === nextProps.broker?.state
  );
});

export default MemoizedRankCard;